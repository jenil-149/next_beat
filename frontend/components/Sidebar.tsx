"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Box from "./Box";
import Library from "./Library";
import SidebarItem from "./SidebarItems";
import { Song } from "@/frontend/types";
import usePlayer from "@/frontend/hooks/usePlayer";
import { twMerge } from "tailwind-merge";

interface SidebarProps {
    children: React.ReactNode;
    songs: Song[];
}

const Sidebar: React.FC<SidebarProps> = ({ children, songs }) => {

    const player = usePlayer();
    const pathname = usePathname();

    const routes = useMemo(
        () => [
            {
                icon: HiHome,
                label: "Home",
                active: pathname !== "/search",
                href: "/",
            },
            {
                icon: BiSearch,
                label: "Search",
                active: pathname === "/search",
                href: "/search",
            },
        ],
        [pathname]
    );

    return (
        <div className={twMerge('flex h-screen bg-black text-white overflow-hidden', player.activeId && 'h-[calc(100%-75px)]')}>
            <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[225px] p-2 shrink-0">
                <Box className="flex flex-col gap-y-4 px-5 py-4">
                    {routes.map((item) => (
                        <SidebarItem key={item.label} {...item} />
                    ))}
                </Box>
                <Box className="overflow-y-auto h-full flex-1 py-2">
                    <Library songs={songs} />
                </Box>
            </div>
            <main className="h-full flex-1 overflow-y-auto py-2 pr-2 pl-2 md:pl-0">
                <div className="bg-neutral-900 rounded-lg h-full w-full overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Sidebar;
