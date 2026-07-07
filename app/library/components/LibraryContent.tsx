"use client";

import { Song } from "@/frontend/types";
import { useRouter } from "next/navigation";
import { useUser } from "@/frontend/hooks/useUser";
import { useEffect } from "react";
import MediaItem from "@/frontend/components/MediaItem";
import LikeButton from "@/frontend/components/LikeButton";
import useOnPlay from "@/frontend/hooks/useOnPlay";
import AddToPlaylistButton from "@/frontend/components/AddToPlaylistButton";

interface LibraryContentProps {
    songs: Song[];
}

const LibraryContent: React.FC<LibraryContentProps> = ({ songs }) => {
    const router = useRouter();
    const { isLoading, user } = useUser();
    const onPlay = useOnPlay(songs);

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/");
        }
    }, [isLoading, user, router]);

    if (songs.length === 0) {
        return (
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400 py-6">
                No songs in your library!
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-2 w-full px-6 py-6">
            {songs.map((song) => (
                <div 
                    key={song.id} 
                    className="flex items-center gap-x-4 w-full"
                >
                    <div className="flex-1">
                        <MediaItem 
                            onClick={(id: string) => onPlay(id)} 
                            data={song} 
                        />
                    </div>
                    <div className="flex items-center gap-x-3" onClick={(e) => e.stopPropagation()}>
                        <LikeButton songID={song.id} />
                        <AddToPlaylistButton songId={song.id} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LibraryContent;
