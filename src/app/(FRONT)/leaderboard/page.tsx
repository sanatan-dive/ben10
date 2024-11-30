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
  netVotes: number;
}

const Leaderboard = () => {
  const { isAuthenticated, isLoading } = useKindeAuth();
  const [leaderboard, setLeaderboard] = useState<User[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("/api/leaderboard");
        console.log("Fetched leaderboard data:", response.data);
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen flex justify-center flex-col items-center">
      {isLoading ? (
        <Loading />
      ) : !isAuthenticated ? (
        <div>
          <div>Please log in to view the leaderboard</div>
          <div>
            <LoginLink>Log in</LoginLink>
          </div>
        </div>
      ) : (
        <div>
          <h2>Leaderboard</h2>
          {leaderboard.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul>
              {leaderboard.map((user) => (
                <li key={user.id}>
                  <img src={user.pfpUrl} alt={`${user.username}'s profile`} />
                  <p>{user.username}</p>
                  <p>Net Votes: {user.netVotes}</p>
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
