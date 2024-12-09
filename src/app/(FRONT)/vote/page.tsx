"use client";

import { LoginLink, useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react"; // Icons for upvote and downvote

// Define the User interface
interface User {
  id: number;
  username: string;
  image: string;
  alienName: string; // Alien name
  alienTitle: string; // Alien title (e.g., "Epic", "Legendary")
}

const Vote = () => {
  const { isAuthenticated, isLoading, user } = useKindeAuth(); // Get user info from KindeAuth
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [voterId, setVoterId] = useState<number | null>(null); // State to store voterId
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false); // State to track loading users

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true); // Start loading
      try {
        const response = await axios.get("/api/getAllUser");
        setUsers(response.data);
        setFilteredUsers(response.data);

        // Set the voterId from the logged-in user
        const currentUser = response.data.find((user: User) => user.id === user?.id);
        if (currentUser) {
          setVoterId(currentUser.id);
        }
      } catch (error) {
        setMessage("Unable to fetch users.");
      } finally {
        setLoadingUsers(false); // End loading
      }
    };
    fetchUsers();
  }, [user]);

  // Filter users by search query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Handle voting
  const handleVote = async (votedUserId: number, value: number) => {
    if (!voterId) {
      setMessage("You must be logged in to vote.");
      return;
    }
    const name = user?.given_name + " " + user?.family_name;
    const userName = name.trim()
    // Prevent voting for self if KindeAuth name matches database name
    const votedUser = users.find((user) => user.id === votedUserId);
    if (votedUser?.username === userName) {
      setMessage("You cannot vote for yourself.");
      return;
    }
  
    
    try {
      setMessage(""); // Clear any previous messages
      const response = await axios.post("/api/vote", {
        voterId,
        votedUserId,
        value,
      });
      console.log("Vote recorded:", response.data);
      setMessage(response.data.message || "Vote recorded successfully.");
    } catch (error: any) {
      console.error("Error recording vote:", error);
      setMessage(
        error.response?.data || "An error occurred while recording your vote."
      );
    }
  };

  // Function to determine the background class based on alien title
  const alienTitleBackgroundClass = (alienTitle: string) => {
    switch (alienTitle) {
      case "Common":
        return "bg-gradient-to-r from-blue-700 to-blue-400";
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
    <div className=" min-h-screen">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      ) : (
        <div className="min-h-screen flex justify-center flex-col items-center p-4">
          {!isAuthenticated ? (
            <div className="text-white text-center">
              <div>Please log in to vote</div>
              <div className="mt-4">
                <LoginLink>
                  <button className="bg-gradient-to-r from-[#00a000] to-[#005900]   px-6 py-3 rounded-lg font-bold transition-all duration-300">
                    Log in
                  </button>
                </LoginLink>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl">
              <h2 className="text-3xl font-bold text-white text-center mb-6">Vote for a User</h2>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for a user..."
                className="w-full p-2 mb-6 border border-green-600 bg-black bg-stone-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {loadingUsers ? (
                <div className="flex justify-center">
                  <Loading />
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="text-center">No users available to vote for.</p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between mb-4 p-4 border rounded text-white bg-stone-950"
                  >
                    <div className="flex items-center">
                      <img
                        src={user.image || "/default-avatar.png"} // fallback if no pfpUrl
                        alt={`${user.username}'s profile`}
                        className="w-14 h-14 rounded-full border-2"
                      />
                      <div className="ml-4">
                        <p className="font-bold text-lg">{user.username}</p>
                        <div className="flex gap-2">
                          <p className="text-md text-green-400">{user.alienName}</p>
                          <p
                            className={`text-sm font-bold flex justify-center items-center ${alienTitleBackgroundClass(
                              user.alienTitle
                            )} text-white px-2  rounded-md`}
                          >
                            {user.alienTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <ArrowUpCircle
                        className="w-8 h-8 cursor-pointer text-green-500 hover:text-green-700"
                        onClick={() => handleVote(user.id, 1)}
                      />
                      <ArrowDownCircle
                        className="w-8 h-8 cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => handleVote(user.id, -1)}
                      />
                    </div>
                  </div>
                ))
              )}
              {message && (
                <p className="text-center mt-6 text-lg font-semibold">{message}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Vote;
