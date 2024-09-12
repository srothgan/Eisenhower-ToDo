import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

const MobileNavbar = ({ open, toggleMenu, navLinks }) => {
    const { data: session } = useSession();

    return (
        <div className={` absolute top-0 right-0 h-full w-screen bg-white transform ${open ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out filter drop-shadow-md z-40 md:hidden`}>
            <div className="flex items-center justify-between filter drop-shadow-md bg-white h-20 px-4">
                <Link href="/" className="text-xl font-semibold">Eisenhower ToDo</Link>
                <button type="button" onClick={toggleMenu} className="z-50 w-8 h-8">
                    <IoCloseCircleOutline className="text-3xl text-black" />
                </button>
            </div>
            <div className="flex flex-col items-center mt-10">
                {navLinks.map((link) => (
                    <Link key={link.key} href={link.url} className="text-xl font-medium my-4" onClick={() => setTimeout(toggleMenu, 100)}>
                        {link.name}
                    </Link>
                ))}
                {session && (
                    <button type="button" onClick={() => signOut()} className="bg-red-600 text-white font-bold px-6 py-2 rounded mt-3">
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
};

export default MobileNavbar;
