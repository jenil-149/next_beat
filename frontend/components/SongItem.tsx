"use client";

import Image from "next/image";
import React from "react";
import { FaPlay } from "react-icons/fa";

interface SongItemProps {
    image: string;
    title: string;
    artist: string;
    onClick?: () => void;
    priority?: boolean;
}

const SongItem: React.FC<SongItemProps> = ({ image, title, artist, onClick, priority }) => {
    return (
        <div
            onClick={onClick}
            className="
                relative 
                group 
                flex 
                flex-col 
                items-center 
                justify-center 
                rounded-md 
                overflow-hidden 
                gap-y-4 
                bg-neutral-400/5 
                cursor-pointer 
                hover:bg-neutral-400/10 
                transition 
                p-3
            "
        >
            <div className="relative aspect-square w-full h-full rounded-md overflow-hidden bg-neutral-800">
                <Image
                    fill
                    src={image}
                    alt={title}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={priority}
                    loading="lazy"
                />
                <div
                    className="
                        absolute 
                        bottom-2 
                        right-2 
                        transition 
                        opacity-0 
                        rounded-full 
                        flex 
                        items-center 
                        justify-center 
                        bg-yellow-400 
                        p-3 
                        drop-shadow-md 
                        group-hover:opacity-100 
                        hover:scale-110
                    "
                >
                    <FaPlay className="text-black" size={12} />
                </div>
            </div>
            <div className="flex flex-col items-start w-full pt-4 gap-y-1">
                <p className="font-semibold truncate w-full text-white">
                    {title}
                </p>
                <p className="text-neutral-400 text-sm pb-4 w-full truncate">
                    By {artist}
                </p>
            </div>
        </div>
    );
};

export default SongItem;
