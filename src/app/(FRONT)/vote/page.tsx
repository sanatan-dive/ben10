"use client";

import { LoginLink, useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";

// Define the User interface
interface User {
  id: number;
  username: string;
  pfpUrl: string;
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

    console.log("Sending vote:", { voterId, votedUserId, value });
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

  return (
    <div className="bg-black text-green-500 min-h-screen">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      ) : (
        <div className="min-h-screen flex justify-center flex-col items-center p-4">
          {!isAuthenticated ? (
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Welcome to the Voting Portal</h1>
              <p className="mb-4">Please log in to cast your vote.</p>
              <LoginLink>
                <button className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded font-bold">
                  Log In
                </button>
              </LoginLink>
            </div>
          ) : (
            <div className="w-full max-w-2xl">
              <h2 className="text-3xl font-bold text-center mb-6">Vote for a User</h2>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for a user..."
                className="w-full p-2 mb-6 border border-green-600 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-green-600"
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
                        src={user.pfpUrl || "/default-avatar.png"} // fallback if no pfpUrl
                        alt={`${user.username}'s profile`}
                        className="w-16 h-16 rounded-full border-2"
                      />
                      <p className="ml-4 font-bold text-lg">{user.username}</p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleVote(user.id, 1)}
                        className="bg-[#32CD32] hover:bg-[#228B22] text-black px-4 py-2 rounded font-bold"
                      >
                        Upvote
                      </button>
                      <button
                        onClick={() => handleVote(user.id, -1)}
                        className="bg-[#FF6347] hover:bg-[#CD5C5C] text-black px-4 py-2 rounded font-bold"
                      >
                        Downvote
                      </button>
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
