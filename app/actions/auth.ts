import {
  SigninFormSchema,
  FormState,
  SignupFormSchema,
} from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

type SigninResponse = {
  errors?: Record<string, string[]>; // Stores any validation errors
};

export async function signin(
  state: FormState,
  formData: FormData,
): Promise<SigninResponse> {
  // 1. Validate form fields
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  try {
    // 2. Send the login request to the server
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { errors: { form: ['Invalid email or password.'] } };
      }

      return {
        errors: errorData.errors || { form: ['Invalid email or password.'] },
      };
    }

    // 3. Handle successful login and redirect
    window.location.href = '/admin';
    return {}; // Empty response, as the redirect will handle further flow
  } catch (error) {
    console.error('Error during signin:', error);
    return { errors: { form: ['An unexpected error occurred.'] } };
  }
}

type SignupResponse = {
  errors?: Record<string, string[]>; // Stores any validation errors
};

export async function signup(
  state: FormState,
  formData: FormData,
): Promise<SignupResponse> {
  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, role } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 2. Insert user into database via API
    const response = await fetch('/api/admin/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        role,
        password: hashedPassword,
      }),
    });

    // Check if the response was not successful
    if (!response.ok) {
      const { errors } = await response.json();
      return { errors: errors || { form: ['Failed to create user.'] } };
    }

    // Redirect if the request was successful
  } catch (error) {
    console.error('Error during signup:', error);
    return { errors: { form: ['An unexpected error occurred.'] } };
  }
  redirect('/admin/employee');
}
