"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import Loading from "@/components/Loading";

export default function Home() {
  const [userName, setUserName] = useState<string>(""); 
  const [error, setError] = useState<string>(""); 
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); 

  const router = useRouter();

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await axios.get(`/api/twitter?username=${userName}`); // Use userName here
      const { name, profile_image_url, followers_count, tweet_count } = response.data;
      localStorage.setItem("username", JSON.stringify(userName));
      console.log("item set")

      router.push(
        `/card?name=${encodeURIComponent(name)}&image=${encodeURIComponent(
          profile_image_url
        )}&followers=${followers_count}&posts=${tweet_count}`
      );
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error fetching Twitter data. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading screen while submitting
  if (isSubmitting) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <Loading />
      </div>
    );
  }

  // Main form UI
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex justify-center items-center text-white"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="flex flex-col items-center p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-4 text-center">
          Enter Your Twitter Id
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <motion.input
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileFocus={{ scale: 1.05 }}
            type="text"
            placeholder="Twitter username"
            value={userName.trim()} // Use userName here
            onChange={(e) => {
              const input = e.target.value;
              // Allow only valid Twitter username characters
              if (/^[a-zA-Z0-9_]*$/.test(input) || input === "") {
                setUserName(input); // Set userName here
              }
            }}
            className="p-2 mb-4 w-64 border border-gray-400 rounded-md text-white bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#00ff00] focus:ring-offset-2"
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