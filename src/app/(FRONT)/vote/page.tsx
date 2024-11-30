"use client";

import { LoginLink, useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";

// Define the User interface to specify the shape of the data
interface User {
  id: number;
  username: string;
  pfpUrl: string;
}

const Vote = ({ voterId }: { voterId: number }) => {
  const { isAuthenticated, isLoading } = useKindeAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching users:", error);
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

  const handleVote = async (votedUserId: number, value: number) => {
    try {
      const response = await axios.post("/api/vote", { voterId, votedUserId, value });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error recording vote.");
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      ) : (
        <div className="min-h-screen flex justify-center flex-col items-center">
          {!isAuthenticated ? (
            <div>
              <div>Please log in to vote</div>
              <div>
                <LoginLink>Log in</LoginLink>
              </div>
            </div>
          ) : (
            <div>
              <h2>Vote for a User</h2>

              {/* Search input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for a user..."
                className="mb-4 p-2 border border-gray-300 rounded"
              />

              {filteredUsers.length === 0 ? (
                <p>No users available to vote for.</p>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user.id} className="mb-4">
                    <img src={user.pfpUrl} alt={`${user.username}'s profile`} className="w-16 h-16 rounded-full" />
                    <p>{user.username}</p>
                    <button onClick={() => handleVote(user.id, 1)}>Upvote</button>
                    <button onClick={() => handleVote(user.id, -1)}>Downvote</button>
                  </div>
                ))
              )}

              {message && <p>{message}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Vote;
