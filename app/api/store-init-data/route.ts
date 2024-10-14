import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/utils/prisma';


export async function POST(request: NextRequest) {
  const { initDataRaw } : { initDataRaw: string } = await request.json();

  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) {
    return NextResponse.json({ message: 'Missing BOT_TOKEN' }, { status: 400 });
  }

  const init_data = new URLSearchParams(initDataRaw);

  const hash = init_data.get('hash');
  if (!hash) {
    return NextResponse.json({ message: 'Missing hash' }, { status: 400 });
  }
 
  // delete hash from init_data
  init_data.delete('hash');

  const authDate = init_data.get('auth_date');
  if (!authDate) {
    return NextResponse.json({ message: 'Missing auth_date' }, { status: 400 });
  }

  const currentTimeStamp = Math.floor(Date.now() / 1000);
  const authTimeStamp = parseInt(authDate, 10);
  const timeDifference = currentTimeStamp - authTimeStamp;
  const maxAge = 5 * 60; // 5 minutes in seconds

  if (timeDifference > maxAge) {
    return NextResponse.json({ message: 'Data is outdated' }, { status: 403 });
  }

  // Create the data-check string
  const dataCheckString = Array.from(init_data.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // Generate the secret key
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN)
    .digest();

  // calculate hash
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // compare hash
  if (computedHash == hash) {
    const validUser = Object.fromEntries(init_data.entries());
    const userString = validUser['user'];

    if (!userString) {
      return NextResponse.json({ message: 'Missing user' }, { status: 400 });
    } else {
      try {
        const user = JSON.parse(userString);
        //modify user key
        user['tg_id'] = user['id'];
        delete user['id'];
        delete user['allows_write_to_pm'];
        user['photo_url'] = `https://api.telegram.org/file/bot${BOT_TOKEN}/${user['photo_url']}`

        // Store or update initData in your database
        await prisma.user.upsert({
          where: { tg_id: user.tg_id },
          create: user,
          update: user
        });

        return NextResponse.json({ message: 'Data is valid', user });
      } catch (error) {
        return NextResponse.json({ message: 'Invalid user' + error }, { status: 400 });
      }
    }
  } else {
    return NextResponse.json({ message: 'Invalid data' }, { status: 403 });
  }
}
