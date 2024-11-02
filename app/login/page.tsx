'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { signin } from '../actions/auth';

export default function Page() {
  const [state, action] = useFormState(signin, undefined);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        action={action}
        className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Sign In
        </h2>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          {state?.errors?.email && (
            <p className="text-sm text-red-500 mt-1">{state.errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          {state?.errors?.password && (
            <div className="text-sm text-red-500 mt-1">
              <p>Password must:</p>
              <ul className="ml-4 list-disc">
                {state.errors.password.map((error) => (
                  <li key={error}>- {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className={`w-full py-2 mt-4 text-white font-semibold rounded-lg 
      ${pending ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
    >
      {pending ? 'Signing In...' : 'Sign In'}
    </button>
  );
}
