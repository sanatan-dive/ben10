"use client";
import Image from "next/image";
import { Flame } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import aliensData from "./alien.json"; // Import the aliens JSON file
import { RainbowButton } from "@/components/ui/rainbow-button";

export default function AlienCard() {
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<any>(null);

  // Utility function to assign alien based on user metrics (followers and posts)
  const assignAlien = (followers: number, posts: number) => {
    let matchedAlien = aliensData.find((alien) => {
      if (followers >= 10000 && posts >= 500) {
        return alien.title === "Legendary";
      } else if (followers >= 5000 && posts >= 300) {
        return alien.title === "Epic";
      } else if (followers >= 1000 || posts >= 100) {
        return alien.title === "Rare";
      }
      return alien.title === "Common";
    });
  
    // Explicit fallback to a valid alien (Common) if no match is found
    return matchedAlien || { name: "Wildmutt", title: "Common", type: "Beast", power: "Enhanced Senses", description: "A wild, beast-like alien with extraordinary senses." };
  };

  useEffect(() => {
    if (searchParams) {
      // Extract query parameters and store in state
      const name = searchParams.get("name") as string;
      const image = searchParams.get("image");
      const followers = Number(searchParams.get("followers"));
      const posts = Number(searchParams.get("posts"));

      // Assign alien based on user data
      const assignedAlien = assignAlien(followers, posts);

      // Set userData state with assigned alien and other user details
      setUserData({
        name,
        image,
        followers,
        posts,
        alienName: assignedAlien.name, // Assign the alien name to 'alienName'
        alienTitle: assignedAlien.title, // Assign the alien title to 'alienTitle'
        alienType: assignedAlien.type, // Assign the alien type
        alienPower: assignedAlien.power, // Assign the alien power
        alienDescription: assignedAlien.description, // Assign the alien description
      });
    }
  }, [searchParams]);

  // Dynamically set the background color for the "Alien Title" section based on alien title
  const alienTitleBackgroundClass = () => {
    switch (userData.alienTitle) {
      case "Common":
        return "bg-blue-500"; // Blue for Common
      case "Rare":
        return "bg-red-500"; // Red for Rare
      case "Epic":
        return "bg-gradient-to-r from-purple-500 to-pink-500"; // Purple gradient for Epic
      case "Legendary":
        return  `bg-gradient-to-r from-red-500 via-yellow-500 to-green-500`; // Rainbow gradient for Legendary
      default:
        return "bg-gray-500"; // Default fallback
    }
  };

  // Calculate post frequency (posts per day as an example)
  const calculatePostFrequency = (posts: number, days: number) => {
    return (posts / days).toFixed(2); // Posts per day (rounded to 2 decimal places)
  };

  const getFlameCount = (alienTitle: string) => {
    switch (alienTitle) {
      case "Common":
        return 1;  // One flame for Common
      case "Rare":
        return 2;  // Two flames for Rare
      case "Epic":
        return 3;  // Three flames for Epic
      case "Legendary":
        return 4;  // Four flames for Legendary
      default:
        return 0;  // Default to 0 flames if no title matches
    }
  };
  
  if (!userData) return <p>Loading...</p>;

  return (
    <div className="p-8 mt-28 flex items-center justify-center ">
      <Card className="w-[400px] bg-gradient-to-br from-green-400 to-blue-300 p-2 rounded-lg shadow-xl">
        <div className="bg-[#f4e7ca] rounded-lg p-3 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-center">
            <div className="flex items-center  gap-2">
              <h2 className="text-xl text-black font-bold">{userData.name}</h2>
              <div className="flex items-center">
                <Flame className="w-4 h-4 text-red-500" />
              </div>
            </div>
          </div>

          {/* Alien Title */}
          <div className="flex items-center justify-center">
            
            //todo add rainbow button
          <div className={`flex justify-center items-center rounded-full w-32 ${alienTitleBackgroundClass()}`}>
            <span className="text-lg text-white text-center font-semibold px-4 py-2 rounded">
              {userData.alienTitle}
            </span>
          </div>
          </div>

          {/* Evolution Info */}
      

          {/* Main Image */}
          <div className="relative h-48 bg-gradient-to-br from-green-500 to-blue-400 rounded-lg overflow-hidden">
          <Image
  src={userData.image || "/placeholder.svg?height=200&width=300"}
  alt={userData.name}
  width={300}
  height={200} // Adjusted height for consistent aspect ratio
  className="object-fill w-full h-full"
/>

          </div>

         

          {/* Abilities */}
          <div className="space-y-3">
            <div className="bg-[#f9f3e3] p-2 rounded">
            <h3 className="font-bold text-black  text-sm">Type: {userData.alienType}</h3>
            <h3 className="font-bold text-black  text-sm"> Power: {userData.alienPower}</h3>
            
      
            </div>

            <div className="flex items-center gap-2">
  <div className="flex">
    {/* Render flames based on the alien title */}
    {Array(getFlameCount(userData.alienTitle)).fill(null).map((_, i) => (
      <Flame key={i} className="w-4 h-4 text-red-500" />
    ))}
  </div>
  <div>
    <h3 className="font-bold text-black ">{userData.alienName}</h3>
    <p className="text-sm text-black ">{userData.alienDescription}</p>
  </div>
  <span className="font-bold text-black  ml-auto">{userData.followers} Power</span>
</div>

            </div>



          {/* Footer */}
          <div className="border-t border-gray-400 pt-2">
            <div className="flex justify-between text-xs">
            <div>
                <span className="font-bold text-black ">Posts</span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-4 bg-blue-400   rounded-full" />
                  <span className="text-black ">{userData.posts}</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-black ">Followers</span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-4 bg-yellow-800 rounded-full" />
                  <span className="text-black ">{userData.followers}</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-black ">Post Frequency</span>
                <div className="flex gap-1 mt-1">
                  <div className="w-4 h-4 bg-gray-300 rounded-full" />
                  <span className="text-black ">{calculatePostFrequency(userData.posts, 30)} Posts/Day</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs italic border border-yellow-600 text-black  p-2 rounded bg-[#f9f3e3]">
            'user description'
          </div>

          {/* Card Number */}
          <div className="text-right text-xs"> ★</div>
        </div>
      </Card>
    </div>
  );
}
