"use client";

import Image from "next/image";
import { Flame } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import aliensData from "./alien.json"; // Import the aliens JSON file
import { RainbowButton } from "@/components/ui/rainbow-button";
import axios from "axios";

interface AlienData {
  name: string;
  title: string;
  type: string;
  power: string;
  description: string;
}

export default function AlienCard() {
  const searchParams = useSearchParams();
  
  const [userData, setUserData] = useState<any>(null);

  // Utility function to assign alien based on user metrics (followers and posts)
  const assignAlien = (followers: number, posts: number): AlienData => {
    const matchedAlien = aliensData.find((alien: AlienData) => {
      if (followers >= 10000 && posts >= 500) {
        return alien.title === "Legendary";
      } else if (followers >= 5000 && posts >= 300) {
        return alien.title === "Epic";
      } else if (followers >= 1000 || posts >= 100) {
        return alien.title === "Rare";
      }
      return alien.title === "Common";
    });

    return (
      matchedAlien || {
        name: "Wildmutt",
        title: "Common",
        type: "Beast",
        power: "Enhanced Senses",
        description: "A wild, beast-like alien with extraordinary senses.",
      }
    );
  };

  const tweets = async (username: string) => {
    if (!username) {
      console.error("Username is required for fetching tweets.");
      return;
    }
    try {
      const response = await axios.get(`/api/tweets?username=${username}`);
      console.log(response.data); // Do something with the tweet data here if needed
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  useEffect(() => {
    let name = searchParams?.get("name");
    let image = searchParams?.get("image");
    let followers = Number(searchParams?.get("followers"));
    let posts = Number(searchParams?.get("posts"));

    // If searchParams are not available, use localStorage
    if (!name) {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        name = storedUsername;
        image = "/default-avatar.png"; // Default avatar if no image
        followers = 0; // Default followers
        posts = 0; // Default posts
      } else {
        console.error("Username not found in searchParams or localStorage.");
        return;
      }
    }

    // Assign alien based on user data
    const assignedAlien = assignAlien(followers, posts);

    setUserData({
      name,
      image,
      followers,
      posts,
      alienName: assignedAlien.name,
      alienTitle: assignedAlien.title,
      alienType: assignedAlien.type,
      alienPower: assignedAlien.power,
      alienDescription: assignedAlien.description,
    });

    // Call the tweet function once the user data is set
    if (name) {
      tweets(name);
    }
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

  const calculatePostFrequency = (posts: number, days: number) =>
    (posts / days).toFixed(2);

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

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="p-8 mt-28 flex items-center justify-center">
      <Card className="w-[400px] p-2 bg-gradient-to-b from-stone-950 to-black rounded-lg shadow-xl">
        <div className=" bg-gradient-to-b from-[#26811ecf] to-[#4ff04632] rounded-lg p-3 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <h2 className="text-xl text-black font-bold">{userData.name}</h2>
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

          {/* Main Image */}
          <div className="relative flex justify-center items-center h-48 bg-gradient-to-br from-green-500 to-blue-400 rounded-lg overflow-hidden">
            <Image
              src={userData.image || "/placeholder.svg"}
              alt={userData.name || "User Image"}
              width={40}
              height={48}
              className=" object-fill w-80 h-48"
            />
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
                <h3 className="font-bold text-black">{userData.alienName}</h3>
                <p className="text-sm text-black">{userData.alienDescription}</p>
              </div>
              <span className="font-bold text-black ml-auto">
                {userData.followers} Power
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-400 pt-2">
            <div className="flex justify-between text-xs">
              <div>
                <span className="font-bold text-black">Posts</span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full" />
                  <span className="text-black">{userData.posts}</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-black">Followers</span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-4 bg-gradient-to-br from-yellow-600 to-yellow-400  rounded-full" />
                  <span className="text-black">{userData.followers}</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-black">Post Frequency</span>
                <div className="flex gap-1 mt-1">
                  <div className="w-4 h-4 bg-gradient-to-br from-gray-600 to-gray-400 rounded-full" />
                  <span className="text-black">
                    {calculatePostFrequency(userData.posts, 30)} Posts/Day
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs italic border border-black text-black p-2 rounded bg-[#e8f9e3]">
            'user description with ai '
          </div>
        </div>
      </Card>
    </div>
  );
}
