"use client";
import { useState } from "react";

export default function Page() {
    const [user, setUser] = useState<Array<User>>();

    // Add your user page logic here
    // fetch from database
    const userData = async () => {
        const res = await fetch("/api/user");
        const data = await res.json();
        setUser(data);
    };

    // delete user
    const deleteUser = async (id: number) => {
        await fetch(`/api/user`, {
            body: JSON.stringify({ id }),
            method: "DELETE",
        });
        await userData();
    };

    // add user
    // const addUser = async (e: HTMLElement) => {
    //     e.preventDefault();
    //     const name = e.target[0].value;
    //     const email = e.target[1].value;
    //     await fetch(`/api/user`, {
    //         body: JSON.stringify({ name, email }),
    //         method: "POST",
    //     });
    //     await userData();
    // };
    const addUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        
        const name = (form.elements.namedItem("name") as HTMLInputElement).value;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    
        await fetch(`/api/user`, {
            body: JSON.stringify({ name, email }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });
    
        await userData(); // Assuming this refreshes the user data
    };    

    return (
        <div className="flex justify-between gap-4 m-10">
            <div>
                <h1>User Page</h1>
                <p>Fetch user data from the database</p>
                <button type="button" onClick={userData}>Get User Data</button>
                <div>**
                    {
                        user && user?.map((user: User) => {
                            return (
                                <div key={user.id}>
                                    <p>{user.id}</p>
                                    <p>{user.name} {user.name}</p>
                                    <p>{user.email}</p>
                                    <p>{user.isPremium ? "Premium" : "Not Premium"}</p>
                                    <button type="button" onClick={() => deleteUser(user.id)}>Delete user</button>
                                </div>
                            )
                        })
                    } 
                </div>
            </div>
            <div>
                <h1>Add User</h1>
                <p>Add a new user to the database  nhgfffffffffff</p>
                <form onSubmit={addUser}>
                    <div className="w-full mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" id="name" className="mt-1 p-2 w-full border border-gray-300 rounded-md" required />
                    </div>
                    <div className="w-full mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" id="email" className="mt-1 p-2 w-full border border-gray-300 rounded-md" required />
                    </div>
                    <div className="w-full">
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md">Add User</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface User {
    id: number;
    name: string;
    email: string;
    isPremium: boolean;
}
