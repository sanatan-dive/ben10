"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Card = () => {
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (searchParams) {
      // Extract query parameters and store in state
      const name = searchParams.get("name");
      const image = searchParams.get("image");
      const followers = Number(searchParams.get("followers"));
      const posts = Number(searchParams.get("posts"));

      // Logic to determine character title based on followers
      const title = followers > 1000 ? "Legendary" : followers > 500 ? "Epic" : "Common";

      setUserData({
        name,
        image,
        followers,
        posts,
        title,  // Added title
      });
    }
  }, [searchParams]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex justify-center items-center  text-white p-4">
      <div className="w-80 bg-stone-900 rounded-xl shadow-lg border border-gray-700 p-4">
        {/* Title Section */}
        <div className="flex justify-center items-center mb-4">
          <span className="text-lg font-semibold px-4 py-2 rounded-full bg-blue-500">
            {userData.title} {/* Displaying the title */}
          </span>
        </div>

        {/* Character Name */}
        <div className="flex justify-center items-center mb-4">
          <h1 className="text-2xl font-bold">{userData.name}</h1>
        </div>

        {/* Image Section */}
        <div className="flex justify-center mb-4">
          <img
            src={userData.image || "https://via.placeholder.com/15"}
            alt={userData.name || "User"}
            className="w-36 h-36 object-cover rounded-full border-4 border-blue-500"
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-gray-400">Followers</span>
            <span className="text-xl font-bold text-blue-400">{userData.followers}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-gray-400">Posts</span>
            <span className="text-xl font-bold text-green-400">{userData.posts}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center">
          <span className="text-sm font-semibold text-gray-400">Twitter User</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
