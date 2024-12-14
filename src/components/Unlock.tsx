import React from "react";
import { motion } from "framer-motion";

function Unlock() {
  return (
    <div className="flex justify-center items-center h-screen  text-white">
      <motion.div
        className="relative w-72 h-96 bg-gradient-to-br  from-[#26811ecf] to-[#4ff04632] rounded-lg shadow-2xl flex flex-col justify-center items-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Green Glow Effect */}
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 bg-[#26811ecf]  blur-3xl opacity-30 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        />

        {/* Unlocking Text */}
        <h1 className="text-2xl font-bold mb-8 z-10">Unlocking Your Card...</h1>

        {/* Loading Bar */}
        <div className="w-4/5 h-4 bg-stone-950 rounded-full overflow-hidden z-10">
          <motion.div
            className="h-full bg-[#4ff04680]  rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6.0 }}
          />
        </div>

        {/* Card Details */}
        <motion.div
          className="absolute bottom-6 w-64 h-40 bg-gradient-to-r  from-[#26811ecf] to-[#4ff04632] rounded-md shadow-lg flex flex-col items-center justify-center text-center z-10 opacity-0"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 5.5, duration: 0.5 }}
        >
          <h2 className="text-lg font-bold">Alien Card Unlocked!</h2>
 
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Unlock;
