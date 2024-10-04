'use client'

// get people from db
const getPeople = async () => {
    const people = await fetch("/api/people");
    return people.json();
}
export default function Page() {
    return <div className="mt-10 mb-20" >
        <h1 className="bg-gray-100 w-full p-4 text-2xl font-bold mb-4 fixed top-0"  >People</h1> 
        {/* {people} */}
        <button onClick={getPeople} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-10">
            Get user
        </button>
    </div>;
}
