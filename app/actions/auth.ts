import { SignupFormSchema, FormState } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

type SignupResponse = {
  errors?: Record<string, string[]>; // Stores any validation errors
};

export async function signup(
  state: FormState,
  formData: FormData,
): Promise<SignupResponse | void> {
  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Prepare data for insertion to db
  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 2. Insert user into database via API
    await fetch('/api/admin/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password: hashedPassword,
      }),
    });
  } catch (error) {
    console.error('Error during signup:', error);
    return { errors: { form: ['An unexpected error occurred.'] } };
  }

  redirect('/admin');
}
