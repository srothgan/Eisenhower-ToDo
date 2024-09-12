"use client";

import { signOut, useSession } from "next-auth/react"
import Link from "next/link";
import React from "react";


const Navbar = () => {
  const { data: session, status } = useSession();


  return (
    <section className="bg-slate-200 p-4 text-black">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <div className="text-xl font-bold">
          <Link href="/">Eisenhower ToDo</Link>
        </div>

        {session && <div>
            <p>Organisation:</p>
            <p className='font-bold' >{session?.user?.organization}</p>
            
        </div>}

        {session && <div>
            <p>Role:</p>
            <p className='font-bold' >{session?.user?.role}</p>
            
        </div>}

        {session && <div>
            <p>E-Mail:</p>
            <p className='font-bold' >{session?.user?.email}</p>
            
        </div>}
        {session &&
        <button type="button" onClick={()=>signOut()} className='bg-red-500 text-white font-bold px-6 py-2 mt-3'>Logout</button>
        }
        
      </div>
    </section>
  );
};

export default Navbar;
