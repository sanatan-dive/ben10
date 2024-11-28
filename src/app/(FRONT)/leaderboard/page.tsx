"use client";

import { LoginLink, useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import React from "react";

const Leaderboard = () => {
  const { isAuthenticated } = useKindeAuth();

  return (
    <div className="min-h-screen flex justify-center flex-col items-center">
      {!isAuthenticated ? (
        <div>
          <div>Please log in to view the leaderboard</div>
          <div>
            <LoginLink>Log in</LoginLink>
          </div>
        </div>
      ) : (
        <div>
          <div>You are logged in</div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
