"use client";

import { signOut, useSession } from "next-auth/react"
import Link from "next/link";
import React, { useState } from "react";
import { IoCloseCircleOutline, IoMenu } from "react-icons/io5";
import MobileNavbar from "./MobileNavbar";
const Navbar = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: 'Matrix', url: '/', key: "1" },
    { name: 'Personal Page', url: '/personal', key: "2" },
    { name: 'About', url: '/about', key: "3" },
  ];

  const toggleMenu = () => setOpen(!open);

  return (
    <section >
      <div className="flex items-center justify-between md:hidden p-4 bg-white filter drop-shadow-xl">
        <div/>
        <div className="text-xl font-bold">
          <Link href="/">Eisenhower ToDo</Link>
        </div>
        <button type="button" className="z-50 relative w-8 h-8 flex-col justify-between items-center md:hidden" onClick={toggleMenu}>
            {open ? <div/> : <IoMenu className="text-3xl text-black" />}
        </button>
        
      </div>
      <MobileNavbar open={open} toggleMenu={toggleMenu} navLinks={navLinks} />
      
      <div className="hidden md:flex justify-between items-center bg-white filter drop-shadow-xl p-4 text-black w-full">
        <div className="text-xl font-bold">
          <Link href="/">Eisenhower ToDo</Link>
        </div>
        {navLinks.map((link) => (
          <Link key={link.key} href={link.url} className="uppercase font-bold hover:underline">
              {link.name}
          </Link>
        ))}
        {session && (
          <button type="button" onClick={() => signOut()} className="bg-red-600 text-white font-bold px-6 py-2 rounded mt-3">
            Logout
          </button>
        )}
      </div>
    </section>
  );
};

export default Navbar;
