"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Flame } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { RainbowButton } from "@/components/ui/rainbow-button";
import aliensData from "./alien.json"; // Import the aliens JSON file
import Loading from "@/components/Loading";
import { toPng } from "html-to-image"; // Import html-to-image
import { FaDownload, FaSquareXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";

interface AlienData {
  name: string;
  title: string;
  type: string;
  power: string;
  description: string;
}

function AlienCardContent() {
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<any>(null);
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);

  // Utility function to assign alien totally randomly
  const assignAlien = (): AlienData => {
    const randomIndex = Math.floor(Math.random() * aliensData.length);
    return aliensData[randomIndex];
  };

  useEffect(() => {

    const username = searchParams?.get("name");
    const image = searchParams?.get("image");
    const followers = Number(searchParams?.get("followers"));
    const posts = Number(searchParams?.get("posts"));

    if (!username) {
      console.error("Missing username");
      return;
    }

    const assignedAlien = assignAlien();

    const newUserData = {
      username,
      image,
      followers,
      posts,
      alienName: assignedAlien.name,
      alienTitle: assignedAlien.title,
      alienType: assignedAlien.type,
      alienPower: assignedAlien.power,
      alienDescription: assignedAlien.description,
    };

    setLoading(true);
    setUserData(newUserData)

    // Fetch user data
    axios
      .get(`/api/getUser?username=${username}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error ) => {
        console.error("Error fetching user data:", error.response?.data || error.message);
      })
      .finally(() => {
        setLoading(false);
      });

    // Save user data and then fetch updated user data
    axios
      .post("/api/saveTwitterUser", newUserData)
      .then((response) => {
        setShowContent(true);
      })
      .catch((error) => {
        console.error("Error saving user data:", error.response?.data || error.message);
      });

    // Fetch AI description from tweets
    axios
      .post(
        "/api/tweets",
        { username },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        setAiDescription(response.data.summary);
      })
      .catch((error) => {
        console.error("Error fetching AI description:", error.response?.data || error.message);
      });

      
      

  }, [searchParams]);

  // Dynamically set the background color for the "Alien Title" section
  const alienTitleBackgroundClass = () => {
    switch (userData?.alienTitle) {
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

  const calculatePostFrequency = (posts: number, days: number) => {
    if (days === 0) return "0 Posts/Day"; // Prevent division by zero
    return ((posts / days) / 10).toFixed(2);
  };

  const getFlameCount = (alienTitle: string) => {
    switch (alienTitle) {
      case "Common":
        return 1;
      case "Rare":
        return 2;
      case "Epic":
        return 3;
      case "Legendary":
        return 4;
      default:
        return 0;
    }
  };

  const shareOnTwitter = () => {
    const tweetContent = encodeURIComponent(
      `${userData.username} has an alien assigned to them! Alien: ${userData.alienName}, Type: ${userData.alienType}, Power: ${userData.alienPower} #alienGame #${userData.alienTitle} https://ben10ify.vercel.app/profile/id?name=${userData.username}`
    );
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetContent}`;
    window.open(twitterUrl, "_blank");
  };

  const downloadCard = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "alien-card.png";
        link.click();
      } catch (error) {
        console.error("Failed to generate image:", error);
      }
    }
  };

  // console.log(userData)

  if (loading || !userData ) return <div className="flex items-center min-h-screen justify-center"><Loading /></div>; 

  return (
    <div className="p-8 mt-2 flex flex-col items-center justify-center">
        <motion.div
  className="relative w-full sm:w-[400px] bg-gradient-to-b from-stone-950 to-black rounded-lg shadow-xl"
  ref={cardRef}
  initial={{ rotateY: 0, scale: 0.7 }} // Start small
  animate={{ rotateY: 1440, scale: 1 }} // Spin and scale to normal size
  transition={{
    duration: 1.5, // Total duration of the animation
    ease: "easeInOut", // Smooth easing
    times: [0, 0.5, 1], // Timing for each phase of animation
  }}
  onAnimationComplete={() => {
    if (!loading) setShowContent(true);
  }}
  
>
      <Card ref={cardRef} className="w-full sm:w-[400px] p-2 bg-gradient-to-b from-stone-950 to-black rounded-lg shadow-xl">
        <div className="bg-gradient-to-b from-[#26811ecf] to-[#4ff04632] rounded-lg p-3 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{userData.username}</h2>
              <Flame className="w-4 h-4 text-red-500" />
            </div>
          </div>

          {/* Alien Title */}
          <div className="flex justify-center">
            <RainbowButton className={`flex justify-center items-center m-0 p-0 inset-0 rounded-full w-32 animate-moving-gradient ${alienTitleBackgroundClass()}`}>
              <span className="text-lg text-white font-semibold px-4 py-2">
                {userData.alienTitle}
              </span>
            </RainbowButton>
          </div>

          {/* Alien and Profile Images */}
          <div className="flex justify-center items-center">
            <div className="relative flex justify-center items-center h-40 sm:h-52 w-40 sm:w-52 bg-stone-950 rounded-lg">
              <Image
                src={userData.image || "/alien.png"} 
                alt="{userData.name} Image"
                width={200}
                height={200}
                className="w-36 h-36 sm:w-48 sm:h-48 border-4 border-stone-900  object-contain rounded-l-lg"
              />
            </div>
          </div>

          {/* Abilities */}
          <div className="space-y-3">
            <div className="bg-[#e8f9e3] p-2 rounded">
              <h3 className="font-bold text-black text-sm">
                Type: {userData.alienType}
              </h3>
              <h3 className="font-bold text-black text-sm">
                Power: {userData.alienPower}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {Array(getFlameCount(userData.alienTitle))
                  .fill(null)
                  .map((_, i) => (
                    <Flame key={i} className="w-4 h-4 text-red-500" />
                  ))}
              </div>
              <div>
                <h3 className="font-bold text-[#e8f9e3]">{userData.alienName}</h3>
                <p className="text-sm text-[#e8f9e3dc]">{userData.alienDescription}</p>
              </div>
              <span className="font-bold text-[#e8f9e3] ml-auto">
                {userData.followers} Power
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-400 pt-2">
            <div className="flex justify-between text-xs">
              <div>
                <span className="font-bold text-[#e8f9e3]">Posts</span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full" />
                  <span className="text-[#f1faee]">{userData.posts}</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-[#e8f9e3]">Followers</span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-4 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-full" />
                  <span className="text-[#f1faee]">{userData.followers}</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-[#e8f9e3]">Post Frequency</span>
                <div className="flex gap-1 mt-1">
                  <div className="w-4 h-4 bg-gradient-to-br from-gray-600 to-gray-400 rounded-full" />
                  <span className="text-[#f1faee]">
                    {calculatePostFrequency(userData.posts, 30)} Posts/Day
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm italic border border-black text-black p-2 rounded bg-[#e8f9e3]">
            {aiDescription ? aiDescription : "Loading AI description..."}
          </div>
        </div>

        {/* Buttons */}
      </Card>
      </motion.div>
      {showContent && (
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-[400px] justify-center">
  
        <button
          className="bg-gradient-to-r from-stone-950 via-stone-700 to-stone-950 text-white py-2 px-4 rounded-full w-full sm:w-auto flex items-center justify-center gap-2 transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          onClick={shareOnTwitter}
        >
          <FaSquareXTwitter className="w-4 h-4" />
          Share on Twitter
        </button>
      
        {/* Download Card Button */}
        <button
          className="bg-gradient-to-r from-blue-800 via-blue-400 to-blue-800 text-white py-2 px-4 rounded-full w-full sm:w-auto flex items-center justify-center gap-2 transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          onClick={downloadCard}
        >
          <FaDownload className="w-4 h-4" />
          Download Card
        </button>
      </div>
      )}
      


    </div>
  );
}

export default function AlienCard(){
  return (
    <Suspense>
      <AlienCardContent />
    </Suspense>
  )
}
