"use client";
import { Song } from "@/frontend/types"
import SongItem from "./SongItem";
import useOnPlay from "@/frontend/hooks/useOnPlay";

interface PageContentsProps {
    songs: Song[];
}

const PageContents: React.FC<PageContentsProps> = ({ songs }: PageContentsProps) => {
    const onPlay = useOnPlay(songs);
    if (songs.length === 0) {
        return (
            <div className='mt-4 text-netural-400'>
                No songs available.
            </div>
        )
    }
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-4">
            {songs.map((item, index) => (
                <SongItem key={item.id}
                    data={item}
                    onClick={(id: string) => onPlay(id)}
                    priority={index < 4}
                />
            ))}
        </div>
    );
}
export default PageContents;   
