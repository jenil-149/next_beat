"use client";

import Image from "next/image";
import useLoadImage from "@/frontend/hooks/useLoadingImage";
import { Song } from "@/frontend/types";

interface MediaItemProps {
    data: Song;
    onClick?: (id: string) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {
    const imageUrl = useLoadImage(data);

    const handleClick = () => {
        if (onClick) {
            return onClick(data.id);
        }
        
        // TODO: Default turn on player
    };

    return (
        <div
            onClick={handleClick}
            className="
                flex 
                items-center 
                gap-x-3 
                cursor-pointer 
                hover:bg-neutral-800/50 
                w-full 
                p-2 
                rounded-md
                transition
            "
        >
            <div 
                className="
                    relative 
                    rounded-md 
                    min-h-[48px] 
                    min-w-[48px] 
                    overflow-hidden
                "
            >
                <Image
                    fill
                    src={imageUrl || "/images/song.png"}
                    alt="Media Item"
                    className="object-cover"
                    sizes="48px"
                />
            </div>
            <div className="flex flex-col gap-y-1 overflow-hidden">
                <p className="text-white truncate text-sm font-semibold">
                    {data.title}
                </p>
                <p className="text-neutral-400 text-xs truncate">
                    {data.author}
                </p>
            </div>
        </div>
    );
};

export default MediaItem;
