"use client";


import Link from "next/link";
import React from "react";


const Footer = () => {
  


  return (
    <section className="bg-white shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.25)] p-4 text-black">
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Brand Logo */}
        <div className="text-lg ">
          <p>Created by Simon Peter Rothgang</p>
        </div>

        <div className="text-lg mt-4 md:mt-0">
          <p>Hosted on Vercel</p>
        </div>

        <div className=" flex gap-2 mt-4 md:mt-0">
          <p>Git Repo:</p>
          <Link className="text-blue-600" href="https://github.com/srothgan/NextJs-Eisenhower-ToDo">Here</Link>
        </div>

       
        
      </div>
    </section>
  );
};

export default Footer;
