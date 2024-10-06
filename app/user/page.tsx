'use client';
import { useEffect, useState } from "react";

function Page() {
    const [userData, setUserData] = useState([] as User[]);

    useEffect(() => {
        fetch('/api/user')
            .then(res => res.json())
            .then(data => setUserData(data));
    }, []);

    // add or post user to db
    const addUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        
        const first_name = (form.elements.namedItem("first_name") as HTMLInputElement).value;
        const last_name = (form.elements.namedItem("last_name") as HTMLInputElement).value;
        const user_name = (form.elements.namedItem("user_name") as HTMLInputElement).value;
    
        await fetch(`/api/user`, {
            body: JSON.stringify({ first_name, last_name, user_name }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });
    };
    

    return (
        <div className="flex items-center justify-between m-5">
            <div className="w-full">
                <h1>This is User Page</h1>
                {userData.map((user : User) => (
                    <div key={user.id} className="m-5">
                        <p>firstname: {user.first_name}</p>
                        <p>lastname: {user.last_name}</p>
                        <p>Username: {user.user_name}</p>
                        <hr />
                    </div>
                ))}
            </div>

            <div>
                <form onSubmit={addUser}>
                    <div className="w-full mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" name="first_name" id="name" className="mt-1 p-2 w-full border border-gray-300 rounded-md" required />
                    </div>
                    <div className="w-full mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" name="last_name" id="email"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md" required />
                    </div>
                    <div className="w-full mb-4">
                        <label htmlFor="isPremium" className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" name="user_name" id="isPremium"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md" required
                         />
                    </div>
                    <div className="w-full">
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md">Add User</button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default Page;


interface User {
    id: string;
    first_name: string;
    last_name: string;
    user_name: string;
}
