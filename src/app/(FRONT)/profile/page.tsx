"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";
import Link from "next/link";
import Image from "next/image";

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

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await axios.get("/api/getAllUser");
        setUsers(response.data);
        const reverse = response.data.reverse();
        setFilteredUsers(reverse);
      } catch (error) {
        setMessage("Unable to fetch users.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

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
    <div className="min-h-screen w-full">
      {loadingUsers ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      ) : (
        <div className="min-h-screen flex justify-center px-4 sm:px-6 lg:px-8 mb-24 flex-col items-center">
          <div className="w-full max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4 sm:mb-6">
              Profiles
            </h2>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for a user..."
              className="w-full p-2 sm:p-3 mb-4 sm:mb-6 border border-green-600 bg-black bg-stone-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            {filteredUsers.length === 0 ? (
              <p className="text-center text-white">No users available.</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row items-center sm:justify-between p-3 sm:p-4 border rounded-lg text-white bg-stone-950 gap-3 sm:gap-4"
                  >
                    <div className="flex items-center w-full sm:w-auto">
                      <Image
                        width={200}
                        height={200}
                        src={user.image}
                        alt={`${user.username}'s profile`}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2"
                      />
                      <div className="ml-3 sm:ml-4">
                      <a 
  href={`https://twitter.com/${user.username}`} 
  target="_blank" 
  rel="noopener noreferrer"
>
  
                        <p className="font-bold text-base sm:text-lg">{user.username}</p>
                      </a>
                        <div className="flex flex-wrap gap-2 items-center">
                          <p className="text-sm sm:text-md text-green-400">{user.alienName}</p>
                          <p
                            className={`text-xs sm:text-sm font-bold px-2 py-1 rounded-md ${alienTitleBackgroundClass(
                              user.alienTitle
                            )}`}
                          >
                            {user.alienTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/profile/id?name=${user.username}`}
                      className="w-full sm:w-auto"
                    >
                      <button className="w-full sm:w-auto bg-gradient-to-r from-[#00a000] to-[#005900] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full hover:opacity-90 transition-opacity text-sm sm:text-base font-medium">
                        Visit Profile
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {message && (
              <p className="text-center mt-4 sm:mt-6 text-base sm:text-lg font-semibold text-white">
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Vote;