"use client"
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import React from "react";
import { signOut, useSession } from "next-auth/react"
const Personal = () => {
    const { data: session } = useSession();



    return (
        <div className="block md:flex w-full p-4 gap-12 text-slate-800">
            <div className="flex flex-col items-center justify-center md:block">
                <CgProfile size={100}/>
            </div>
            <div className='flex flex-col items-center justify-center md:block '>
                <p>Name:</p>
                <p className='font-bold'>{session?.user?.name}</p>
                <p>E-Mail:</p>
                <p className='font-bold' >{session?.user?.email}</p>
                <p>Organization:</p>
                <p className='font-bold' >{session?.user?.organization}</p>
                <p>Role:</p>
                <p className='font-bold' >{session?.user?.role}</p>
            </div>
        </div>
    );
};

export default Personal;
