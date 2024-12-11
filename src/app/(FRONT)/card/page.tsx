"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Flame } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { RainbowButton } from "@/components/ui/rainbow-button";
import aliensData from "./alien.json"; // Import the aliens JSON file
import Loading from "@/components/Loading";

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

  // Utility function to assign alien totally randomly
  const assignAlien = (): AlienData => {
    // Randomly select one alien from the entire list
    const randomIndex = Math.floor(Math.random() * aliensData.length);
    return aliensData[randomIndex];
  };

  useEffect(() => {
    let username = searchParams?.get("name");
    let image = searchParams?.get("image"); // Use user.picture if logged in, else fallback to searchParams image
    let followers = Number(searchParams?.get("followers"));
    let posts = Number(searchParams?.get("posts"));

    if (!username) {
      console.error("Missing username");
      return;
    }

    // Assign alien based on user metrics
    const assignedAlien = assignAlien();

    // Prepare user data object
    const newUserData = {
      username,
      image: image,
      followers,
      posts,
      alienName: assignedAlien.name,
      alienTitle: assignedAlien.title,
      alienType: assignedAlien.type,
      alienPower: assignedAlien.power,
      alienDescription: assignedAlien.description,
    };

    setLoading(true);

    // Fetch user data from the backend
    axios
      .get(`/api/getUser?username=${username}`)
      .then((response) => {
        setUserData(response.data); // Set the user data from the database
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      })
      .finally(() => {
        setLoading(false);
      });

      axios
    .post("/api/tweets", { username }, { headers: { "Content-Type": "application/json" } })
    .then((response) => {
      setAiDescription(response.data.summary); // Adjust to your backend's response structure
    })
    .catch((error) => {
      console.error("Error fetching user data:", error.response?.data || error.message);
    });

    axios
    .post("/api/saveTwitterUser", newUserData, { headers: { "Content-Type": "application/json" } })
    .then((response) => {
      console.log("User data saved successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error saving user data:", error);
    });

  }, [searchParams]);

  // Dynamically set the background color for the "Alien Title" section
  const alienTitleBackgroundClass = () => {
    switch (userData?.alienTitle) {
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
      `${userData.username} has an alien assigned to them! Alien: ${userData.alienName}, Type: ${userData.alienType}, Power: ${userData.alienPower} #alienGame #${userData.alienTitle} https://yourwebsite.com/profile/${userData.username}`
    );
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetContent}`;
    window.open(twitterUrl, "_blank");
  };

  if (loading || !userData) return <div className="flex items-center min-h-screen justify-center"><Loading /></div>; // Show loading until data is available

  return (
    <div className="p-8 mt-28 flex flex-col items-center justify-center">
      <Card className="w-[400px] p-2 bg-gradient-to-b from-stone-950 to-black rounded-lg shadow-xl">
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
            <div className="relative flex justify-center items-center h-52 w-52 bg-stone-950 rounded-lg">
              <Image
                src={userData.image || "/placeholder-profile.svg"}
                alt={userData.name || "Profile Image"}
                width={80}
                height={80}
                className="w-48 h-48 border-4 border-stone-900  object-contain rounded-l-lg"
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

        {/* Share Button */}
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-full"
            onClick={shareOnTwitter}
          >
            Share on Twitter
          </button>
        </div>
        
      </Card>
  
    </div>
    
  );
}

export default function AlienCard() {
  return (
    <Suspense fallback={<Loading />}>
      <AlienCardContent />
    </Suspense>
  );
}
