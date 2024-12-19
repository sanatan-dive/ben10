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
        setLeaderboard(response.data);
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
  const filteredLeaderboard = leaderboard
    .filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => alienTitlePriority(b.alienTitle) - alienTitlePriority(a.alienTitle)); // Sort based on priority

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
    <div className="min-h-screen flex justify-center flex-col items-center p-6">
      {loadingUsers ? (
        <Loading />
      ) : (
        <div className="w-full max-w-2xl p-6 bg-stone-900 rounded-xl shadow-xl border border-green-600">
          <h2 className="text-4xl font-extrabold text-center text-white mb-6">Leaderboard</h2>
          {/* Search Box */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username"
              className="w-full p-3 bg-stone-800 text-white rounded-md shadow-md"
            />
          </div>
          {filteredLeaderboard.length === 0 ? (
            <p className="text-center text-white">No users found.</p>
          ) : (
            <ul className="space-y-6">
              {filteredLeaderboard.map((user, index) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-stone-950 border-2 rounded-lg shadow-md"
                >
                  <div className="flex items-center gap-2 space-x-4">
                    <span className="text-lg font-bold text-green-400">#{index + 1}</span> {/* Rank */}
                    <Image
                      width={200}
                      height={200}
                      src={user.image}
                      alt={`${user.username}'s profile`}
                      className="w-14 h-14 rounded-full border-2"
                    />
                    <div>
                      <p className="font-bold text-white text-lg">{user.username}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-md text-green-400">{user.alienName}</p>
                        <p
                          className={`text-sm font-bold flex justify-center items-center ${alienTitleBackgroundClass(
                            user.alienTitle
                          )} text-white px-2 rounded-md`}
                        >
                          {user.alienTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
