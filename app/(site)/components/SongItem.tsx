"use client";
import { Song } from "@/frontend/types";
import useLoadImage from "@/frontend/hooks/useLoadingImage";
import Image from "next/image";
import PlayButton from "@/frontend/components/PlayButton";
import LikeButton from "@/frontend/components/LikeButton";
import AddToPlaylistButton from "@/frontend/components/AddToPlaylistButton";

interface SongItemProps {
    data: Song;
    onClick?: (id: string) => void;
    priority?: boolean;
}

const SongItem: React.FC<SongItemProps> = ({ data, onClick, priority }) => {

    const imagePath = useLoadImage(data);
    return (
        <div
            onClick={() => onClick?.(data.id)}
            className="
                relative
                group
                flex
                flex-col
                items-center
                justify-center
                rounded-lg
                overflow-hidden
                cursor-pointer
                bg-neutral-400/20
                transition
                p-3
                md:p-4
                hover:scale-103
            "
        >
            <div
                className="
                    relative
                    w-full
                    bg-neutral-400/20
                    aspect-square
                    rounded-md
                    overflow-hidden
                "
            >
                <Image
                    className="object-cover"
                    src={imagePath || "/images/song.png"}
                    alt="Image"
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 17vw"
                    priority={priority}
                />
                <div className="
                    absolute 
                    bottom-4 
                    right-4
                ">
                    <PlayButton />
                </div>
            </div>
            <div className="flex justify-between items-center w-full pt-4 gap-x-1 md:gap-x-2">
                <div className="flex flex-col items-start w-full gap-y-1 overflow-hidden">
                    <p className="font-semibold text-sm md:text-md truncate w-full text-white">
                        {data.title}
                    </p>
                    <p className="text-neutral-400 text-xs md:text-sm truncate w-full">
                        by {data.author}
                    </p>
                </div>
                <div className="flex items-center gap-x-1.5 md:gap-x-2 flex-shrink-0 z-10" onClick={(e) => e.stopPropagation()}>
                    <LikeButton songID={data.id} />
                    <AddToPlaylistButton songId={data.id} />
                </div>
            </div>
        </div>
    );
};

export default SongItem;
