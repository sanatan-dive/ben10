"use client";

import { LoginLink, useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";
import Link from "next/link";

// Define the User interface to specify the shape of the data
interface User {
  id: number;
  username: string;
  image: string;
  netVotes: number;
}

const Leaderboard = () => {
  const { isAuthenticated, isLoading,user } = useKindeAuth();
  const [leaderboard, setLeaderboard] = useState<User[]>([]);

  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

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

  return (
    <div className="min-h-screen flex justify-center flex-col items-center  p-6">
      {isLoading ? (
        <Loading />
      ) : !isAuthenticated ? (
        <div className="text-white text-center">
          <div>Please log in to view the leaderboard</div>
          <div className="mt-4">
            <LoginLink>
              <button className="bg-gradient-to-r from-[#00a000] to-[#005900]   px-6 py-3 rounded-lg font-bold transition-all duration-300">
                Log in
              </button>
            </LoginLink>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl p-6 bg-stone-900 rounded-xl shadow-xl border border-green-600">
          <h2 className="text-4xl font-extrabold text-center text-white mb-6">Leaderboard</h2>
          {loadingUsers ? (
            <div>
              <Loading />
            </div>
          ) : leaderboard.length === 0 ? (
            <p className="text-center text-white">No users found.</p>
          ) : (
            <ul className="space-y-6">
              {leaderboard.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-stone-950 border-2  rounded-lg shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.image}
                      alt={`${user.username}'s profile`}
                      className="w-14 h-14 rounded-full border-2 "
                    />
                    <div>
                      <p className="font-bold text-white text-lg">{user.username}</p>
                      <p className="text-green-400">Net Votes: {user.netVotes}</p>
                    </div>
                  </div>
                  <Link href={`/vote?userId=${user.id}`} className="text-white">
                  <div className="bg-gradient-to-r from-[#00a000] to-[#005900] text-white px-4 py-2 rounded-full hover:bg-green-600 cursor-pointer">
                    Vote
                  </div>
                  </Link>
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
