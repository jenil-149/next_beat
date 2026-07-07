"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { TbPlaylist } from "react-icons/tb";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/frontend/hooks/useUser";
import Button from "@/frontend/components/Button";
import useAuthModal from "@/frontend/hooks/useAuthModal";
import { FaUserAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import Image from "next/image";

interface HeaderProps {
    children: React.ReactNode;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Logout successfully");
            router.refresh();
            router.push("/");
        }
    };
    const handleLibraryClick = () => {
        if (!user) {
            return authModal.onOpen();
        }
        router.push("/library");
    };
    const authModal = useAuthModal();
    const supabaseClient = useSupabaseClient();
    const { user, userDetails } = useUser();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (userDetails?.avatar_url) {
            Promise.resolve().then(() => {
                if (userDetails.avatar_url!.startsWith("http")) {
                    setAvatarUrl(userDetails.avatar_url!);
                } else {
                    const { data } = supabaseClient
                        .storage
                        .from("images")
                        .getPublicUrl(userDetails.avatar_url!);
                    setAvatarUrl(data.publicUrl);
                }
            });
        } else {
            Promise.resolve().then(() => {
                setAvatarUrl(null);
            });
        }
    }, [userDetails, supabaseClient]);
    return (
        <div
            className={twMerge(
                "h-fit bg-gradient-to-b from-yellow-800 p-6",
                className
            )}
        >
            <div className="w-full mb-4 flex items-center justify-between">
                <div className="hidden md:flex gap-x-2 items-center">
                    <button
                        onClick={() => router.back()}
                        className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition cursor-pointer p-1.5"
                    >
                        <RxCaretLeft className="text-white" size={35} />
                    </button>
                    <button
                        onClick={() => router.forward()}
                        className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition cursor-pointer p-1.5"
                    >
                        <RxCaretRight className="text-white" size={35} />
                    </button>
                </div>
                <div className="flex md:hidden gap-x-2 items-center">
                    <button
                        onClick={() => router.push("/")}
                        className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition cursor-pointer"
                    >
                        <HiHome className="text-black" size={20} />
                    </button>
                    <button
                        onClick={() => router.push("/search")}
                        className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition cursor-pointer"
                    >
                        <BiSearch className="text-black" size={20} />
                    </button>
                    <button
                        onClick={handleLibraryClick}
                        className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition cursor-pointer"
                    >
                        <TbPlaylist className="text-black" size={20} />
                    </button>
                </div>
                <div className="flex justify-between items-center gap-x-4">
                    {user ? (
                        <div className="flex items-center gap-x-4">
                            <Button
                                onClick={handleLogout}
                                className="bg-white px-6 py-2 w-auto"
                            >
                                Logout
                            </Button>
                            <Button
                                onClick={() => router.push('/account')}
                                className="bg-white w-10 h-10 flex items-center justify-center p-0 overflow-hidden relative"
                            >
                                {avatarUrl ? (
                                    <Image 
                                        src={avatarUrl} 
                                        alt="Profile" 
                                        fill 
                                        className="object-cover"
                                    />
                                ) : (
                                    <FaUserAlt />
                                )}
                            </Button>
                        </div>
                    ) : (

                        <>

                            <div>
                                <Button
                                    onClick={authModal.onOpen}
                                    className="bg-transparent text-neutral-300 font-medium hover:text-white transition">
                                    Sign up
                                </Button>
                            </div>
                            <div>
                                <Button
                                    onClick={authModal.onOpen}
                                    className="bg-white text-black px-6 py-2">
                                    Log in
                                </Button>
                            </div>
                        </>)}
                </div>
            </div>
            {children}
        </div>
    );
};

export default Header;