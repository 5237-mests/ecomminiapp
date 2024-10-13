// app/api/get-profile-photo/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { userId } = await request.json();
  const botToken = process.env.BOT_TOKEN as string;

  try {
    const response = await axios.get(`https://api.telegram.org/bot${botToken}/getUserProfilePhotos`, {
      params: {
        user_id: userId,
        limit: 1
      }
    });

    const photos = response.data.result.photos;
    if (photos.length > 0) {
      const fileId = photos[0][0].file_id;
      const fileResponse = await axios.get(`https://api.telegram.org/bot${botToken}/getFile`, {
        params: {
          file_id: fileId
        }
      });

      const filePath = fileResponse.data.result.file_path;
      const photoUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;

      return NextResponse.json({ photoUrl });
    } else {
      return NextResponse.json({ error: 'No profile photo found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile photo' + error }, { status: 500 });
  }
}
