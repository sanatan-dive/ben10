"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Flame } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { RainbowButton } from "@/components/ui/rainbow-button";
import Loading from "@/components/Loading";
import { LoginLink, useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

const Profile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useKindeAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false); // Stop loading if the user is not authenticated
      return;
    }

    const username = user?.given_name || "defaultUsername";

    // Fetch user data
    axios
      .get(`/api/getUser?username=${username}`)
      .then((response) => {
        setUserData(response.data); // Set the user data from the database
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  // Alien title background
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
    if (days === 0) return "0 Posts/Day";
    return (posts / days).toFixed(2);
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

  // Handle loading state
  if (loading) return
  <div className="flex items-center justify-center min-h-screen">
      <Loading />;
  </div> 

  

  // Render profile
  return (
    <div className="p-8  flex flex-col  items-center min-h-screen justify-center">
        {!isAuthenticated ?(
             <div className="flex justify-center gap-4 flex-col items-center ">
             <h2 className="text-md ">Please log in to access your profile!</h2>
             <LoginLink>
                   <button className="bg-gradient-to-r from-[#00a000] to-[#005900]  px-6 py-3 rounded-lg font-bold transition-all duration-300">
                     Log in
                   </button>
                 </LoginLink>
           </div>

        ):(
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
            <RainbowButton
              className={`flex justify-center items-center m-0 p-0 inset-0 rounded-full w-32 animate-moving-gradient ${alienTitleBackgroundClass()}`}
            >
              <span className="text-lg text-white font-semibold px-4 py-2">
                {userData.alienTitle}
              </span>
            </RainbowButton>
          </div>

          {/* Alien and Profile Images */}
          <div className="flex justify-center items-center">
            <div className="relative flex justify-center items-center h-52 w-52 bg-stone-950 rounded-lg">
              <Image
                src={user?.picture || userData.image || "/placeholder-profile.svg"}
                alt={userData.name || "Profile Image"}
                width={80}
                height={80}
                className="w-48 h-48 border-4 border-stone-900 object-contain rounded-l-lg"
              />
            </div>
          </div>

          {/* Abilities */}
          <div className="space-y-3">
            <div className="bg-[#e8f9e3] p-2 rounded">
              <h3 className="font-bold text-black text-sm">Type: {userData.alienType}</h3>
              <h3 className="font-bold text-black text-sm">Power: {userData.alienPower}</h3>
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
                  <div className="w-4 h-4 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-full" />
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
        </div>
      </Card>)}
    </div>
  );

};

export default Profile;
