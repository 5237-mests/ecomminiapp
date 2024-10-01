import { FaSearch } from "react-icons/fa";

const page: React.FC = () => {
  return (
    <div className="mt-20">
      <h1 className="bg-gray-100 w-full p-4 text-2xl font-bold mb-4 fixed top-0">
        Search
      </h1>

      <input
        type="text"
        placeholder="Search here"
        className="w-[90%] block h-10 mx-4 p-4 border-2 border-gray-300 rounded-lg mx-auto"
      />

      <div className="flex flex-col gap-4 items-center pt-20">
        <FaSearch
          size={90}
          className="text-6xl border-4 p-6 text-sky-500 rounded-full"
        />
        <h2 className="text-2xl font-bold">The place seems to be empty</h2>
        <p className="text-sky-500">Enter search query</p>
      </div>
    </div>
  );
};

export default page;
