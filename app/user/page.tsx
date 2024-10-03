"use client";
import { useState } from "react";

export default function Page() {
    const [user, setUser] = useState<Array<any>>();

    // Add your user page logic here
    // fetch from database
    const userData = async () => {
        const res = await fetch("/api/user");
        const data = await res.json();
        setUser(data);
        console.log('TABLES',data)
    };

    // delete user
    const deleteUser = async (id: number) => {
        const res = await fetch(`/api/user`, {
            body: JSON.stringify({ id }),
            method: "DELETE",
        });
        const data = await res.json();
        console.log("deleted",data)
    };
    return (
        <div>
            <h1>User Page</h1>
            <p>Fetch user data from the database</p>
            <button type="button" onClick={userData}>Get User Data</button>
            // render user data
            <div>**
                {/* {
                    user && user?.map((user: any) => {
                        return (
                            <div>
                                <p>{user.id}</p>
                                <p>{user.name} {user.name}</p>
                                <p>{user.email}</p>
                                <p>{user.isPremium ? "Premium" : "Not Premium"}</p>
                                {/* delete user */}
                                {/* <button type="button" onClick={() => deleteUser(user.id)}>Delete user</button>
                            </div>
                        )
                    })
                } */} 
            </div>
        </div>
    );
}