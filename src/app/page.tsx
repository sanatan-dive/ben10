"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Fetch user data from the backend API
      const response = await axios.get(`/api/twitter?username=${username}`);
      const userData = response.data;

      // Manually build the query string using URLSearchParams
      const query = new URLSearchParams({
        name: userData.name,
        image: userData.profile_image_url,
        followers: userData.public_metrics.followers_count.toString(),
        posts: userData.public_metrics.tweet_count.toString(),
      }).toString();

      // Navigate to the /card page with the query string
      router.push(`/card?${query}`);
    } catch (err) {
      setError("Error fetching Twitter data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center flex-col items-center  text-white">
      <h1 className="text-2xl font-bold mb-4">Enter Your Twitter Username</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Twitter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 mb-4 border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-black rounded-md shadow-md  hover:bg-green-400"
        >
          Submit
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
