'use client';
import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '@/app/actions/auth';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

interface Props {
  setAddEmployeeModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Page({ setAddEmployeeModal }: Props) {
  const [state, action] = useFormState(signup, undefined);
  const { pending } = useFormStatus();

  const [showPassword, setShowPassword] = useState(false);
  //   const [error, setError] = useState<string | null>(null);

  enum Role {
    user = 'user',
    admin = 'admin',
    superadmin = 'superadmin',
    delivery = 'delivery',
  }
  const roles = Object.values(Role);

  useEffect(() => {
    if (state?.errors) {
      //   const errorMessage = Object.values(state.errors).flat().join(', ');
      //   setError(errorMessage);
    } else {
      //   setError(null);
    }
  }, [state?.errors]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen bg-gray-600 bg-opacity-75">
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-96">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Employee
          </h3>
          <button
            type="button"
            onClick={() => setAddEmployeeModal(false)}
            className="text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg w-8 h-8"
          >
            <span className="sr-only">Close modal</span>
            <IconEyeOff />
          </button>
        </div>

        <div className="p-4 md:p-5">
          <form className="space-y-4" action={action}>
            <div>
              <label className="block mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-600"
                placeholder="Employee Name"
                required
              />
              {state?.errors?.name && (
                <p className="text-red-500">{state.errors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-600"
                placeholder="name@company.com"
                required
              />
              {state?.errors?.email && (
                <p className="text-red-500">{state.errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Role</label>
              <select
                name="role"
                className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-600"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select a role
                </option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-600"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-3"
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {state?.errors?.password && (
                <ul className="text-red-500">
                  {state.errors.password.map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              )}
            </div>

            <button
              disabled={pending}
              type="submit"
              className={`w-full p-2.5 rounded-lg ${
                pending ? 'bg-gray-400' : 'bg-blue-700 text-white'
              }`}
            >
              {pending ? (
                <div className="animate-spin h-5 w-5 border-b-2 border-white mx-auto"></div>
              ) : (
                'Sign Up'
              )}
            </button>

            {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
          </form>
        </div>
      </div>
    </div>
  );
}
