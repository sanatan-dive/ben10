"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";
import Image from "next/image";

// Define the User interface to specify the shape of the data
interface User {
  id: number;
  username: string;
  image: string;
  alienName: string;
  alienTitle: string;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingUsers(true);
      try {
        const response = await axios.get("/api/leaderboard");
        setLoadingUsers(false);
        const sortedLeaderboard = response.data.sort(
          (a: User, b: User) => alienTitlePriority(b.alienTitle) - alienTitlePriority(a.alienTitle)
        );
        setLeaderboard(sortedLeaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLoadingUsers(false); // Stop loading even if there's an error
      }
    };

    fetchLeaderboard();
  }, []);

  // Function to assign priority based on alien title
  const alienTitlePriority = (alienTitle: string) => {
    switch (alienTitle) {
      case "Legendary":
        return 4;
      case "Epic":
        return 3;
      case "Rare":
        return 2;
      case "Common":
        return 1;
      default:
        return 0;
    }
  };

  // Function to filter users based on the search query
  const filteredLeaderboard = leaderboard.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="min-h-screen flex justify-center flex-col items-center p-3 sm:p-4 md:p-6">
      {loadingUsers ? (
        <Loading />
      ) : (
        <div className="w-full max-w-2xl p-3 sm:p-4 md:p-6 mb-16 sm:mb-20 md:mb-24 bg-stone-900 rounded-xl shadow-xl border border-green-600">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-white mb-4 sm:mb-6">
            Leaderboard
          </h2>
          
          <div className="mb-4 sm:mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username"
              className="w-full p-2 sm:p-3 bg-stone-800 text-white rounded-md shadow-md border border-stone-700 focus:border-green-500 focus:outline-none"
            />
          </div>

          {filteredLeaderboard.length === 0 ? (
            <p className="text-center text-white text-sm sm:text-base">No users found.</p>
          ) : (
            <ul className="space-y-3 sm:space-y-4 md:space-y-6">
              {filteredLeaderboard.map((user) => {
                const rank = leaderboard.findIndex((u) => u.id === user.id) + 1;
                return (
                  <li
                    key={user.id}
                    className="flex items-center justify-between p-2 sm:p-3 md:p-4 bg-stone-950 border border-stone-800 rounded-lg shadow-md hover:border-green-600 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <span className="text-base sm:text-lg font-bold text-green-400 min-w-[24px] sm:min-w-[28px] text-center">
                        #{rank}
                      </span>
                      
                      <img
                        src={user.image}}
                        alt={`${user.username}'s profile`}
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 object-cover"
                      />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <p className="font-bold text-white text-sm sm:text-base md:text-lg">
                          {user.username}
                        </p>
                        <div className="flex items-center gap-2 mt-1 sm:mt-0">
                          <p className="text-xs sm:text-sm md:text-md text-green-400">
                            {user.alienName}
                          </p>
                          <p
                            className={`text-xs sm:text-sm font-bold px-2 py-0.5 rounded-md ${alienTitleBackgroundClass(
                              user.alienTitle
                            )}`}
                          >
                            {user.alienTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
