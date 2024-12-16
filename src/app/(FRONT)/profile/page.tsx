"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";
import Link from "next/link"; // Import Link for navigation
import Image from "next/image";

// Define the User interface
interface User {
  id: number;
  username: string;
  image: string;
  alienName: string;
  alienTitle: string;
  followers: number;
  posts: number;
}

const Vote = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true); // Start loading
      try {
        const response = await axios.get("/api/getAllUser");
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        setMessage("Unable to fetch users.");
      } finally {
        setLoadingUsers(false); // End loading
      }
    };
    fetchUsers();
  }, []);

  // Filter users by search query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Function to determine the background class based on alien title
  const alienTitleBackgroundClass = (alienTitle: string) => {
    switch (alienTitle) {
      case "Common":
        return "bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700";
      case "Rare":
        return "bg-gradient-to-r from-red-800 via-red-500 to-red-800";
      case "Epic":
        return "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500";
      case "Legendary":
        return "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rainbow-bg";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen">
      {loadingUsers ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      ) : (
        <div className="min-h-screen flex justify-center flex-col items-center p-4">
          <div className="w-full max-w-2xl">
            <h2 className="text-3xl font-bold text-white text-center mb-6">Profiles</h2>
            
            {/* Search Bar */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for a user..."
              className="w-full p-2 mb-6 border border-green-600 bg-black bg-stone-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            {/* Render other users' profiles */}
            {filteredUsers.length === 0 ? (
              <p className="text-center">No users available.</p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between mb-4 p-4 border rounded text-white bg-stone-950"
                >
                  <div className="flex items-center">
                    <Image
                      width={200}
                      height={200}
                      src={user.image} 
                      alt={`${user.username}'s profile`}
                      className="w-14 h-14 rounded-full border-2"
                    />
                    <div className="ml-4">
                      <p className="font-bold text-lg">{user.username}</p>
                      <div className="flex gap-2">
                        <p className="text-md text-green-400">{user.alienName}</p>
                        <p
                          className={`text-sm font-bold flex justify-center  items-center ${alienTitleBackgroundClass(
                            user.alienTitle
                          )} text-white px-2  rounded-md`}
                        >
                          {user.alienTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Visit Button */}
                  <Link href={`/profile/${user.username}`}>
  <button className="bg-gradient-to-r from-[#00a000] to-[#005900] text-white px-4 py-3 scale-[80%] sm:scale-100 rounded-full hover:bg-gradient-to-r hover:from-[#00a000] hover:to-[#005900] mt-2 sm:px-8 sm:py-4 sm:mt-0">
    Visit Profile
  </button>
</Link>

                </div>
              ))
            )}

            {/* Display messages */}
            {message && (
              <p className="text-center mt-6 text-lg font-semibold">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Vote;
