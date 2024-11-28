"use client";

import { LoginLink, RegisterLink, useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import React from "react";

const Vote = () => {
  const { isAuthenticated } = useKindeAuth();

  return (
    <div>
    <div className="min-h-screen flex justify-center flex-col items-center">
      {!isAuthenticated ? (
        
        <div>
          <div>
            Please log in to vote
          </div>
          <div>
          <LoginLink>Log in</LoginLink>
          </div>

        </div>
        
        
        
      ):
    (
      <div>
        <div>
          You are logged in
        </div>
      </div>
    )
      }
    </div>
    </div>
     
  );
};

export default Vote;
