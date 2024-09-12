"use client";


import Link from "next/link";
import React from "react";


const Footer = () => {
  


  return (
    <section className="bg-slate-200 p-4 text-black">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <div className="text-xl font-bold">
          <p>Created by Simon Rothgang</p>
        </div>

        <div className="text-xl font-bold">
          <p>Hosted on Vercel</p>
        </div>

        <div className="text-xl font-bold flex flex-col">
          <p>Git Repo:</p>
          <Link href="https://github.com/srothgan/NextJs-Eisenhower-ToDo">Here</Link>
        </div>

       
        
      </div>
    </section>
  );
};

export default Footer;
