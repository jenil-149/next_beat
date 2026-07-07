"use client";

import { Song } from "@/frontend/types";
import MediaItem from "@/frontend/components/MediaItem";
import LikeButton from "@/frontend/components/LikeButton";
import AddToPlaylistButton from "@/frontend/components/AddToPlaylistButton";
import useOnPlay from "@/frontend/hooks/useOnPlay";

interface SearchContentProps {
    songs: Song[];
}

const SearchContent = ({ songs }: SearchContentProps) => {
    const onPlay = useOnPlay(songs);

    if (songs.length === 0) {
        return (
            <div className="
                flex
                flex-col
                gap-y-2
                w-full 
                px-6 
                text-neutral-400 
                mt-4
            ">
                <h1>Nothing found!</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-2 px-4 mt-4 w-full">
            {songs.map((song) => (
                <div key={song.id} className="flex items-center gap-x-4 w-full pr-2">
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

export default SearchContent;