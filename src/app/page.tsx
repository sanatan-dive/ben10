"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { motion } from "framer-motion";
import Loading from "@/components/Loading";

export default function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useKindeAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      console.log("hitting api");
  
      // Save the username in the database
      await axios.post("/api/saveTwitterUser", { username });
  
      // Fetch user data from the backend API
      const response = await axios.get(`/api/twitter?username=${username}`);
      const tweetResponse = await axios.get(`/api/tweets?username=${username}`);
      const userTweets = tweetResponse.data;
      const userData = response.data;
      console.log(userTweets);
  
      // Build the query string using URLSearchParams
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
    } finally {
      setIsSubmitting(false);
    }
  };
  

  useEffect(() => {
    if (isAuthenticated && user?.given_name) {
      setUsername(user.given_name);
    }
  }, [isAuthenticated, user]);

  // Show loading animation while authentication is being determined
  if (isLoading || isSubmitting) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <Loading /> {/* Replace this with your loading animation component */}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex justify-center items-center  text-white"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="flex flex-col items-center  p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-4 text-center">Enter Your Twitter Username</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <motion.input
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileFocus={{ scale: 1.05 }}
            type="text"
            placeholder="Twitter Username"
            value={username.trim()}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 mb-4 w-64 border border-gray-400 rounded-md  text-white bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#00ff00] focus:ring-offset-2"
            required
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-[#00a000] to-[#005900] text-white font-medium rounded-full shadow-md transition-transform"
          >
            Submit
          </motion.button>
        </form>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mt-4"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
