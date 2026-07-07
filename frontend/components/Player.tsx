"use client";

import { useEffect } from "react";
import usePlayer from "@/frontend/hooks/usePlayer";
import useGetSongByid from "@/frontend/hooks/useGetSongByid";
import useLoadSongUrl from "@/frontend/hooks/useLoadSongUrl";
import PlayerContent from "./PlayerContent";
import { useUser } from "@/frontend/hooks/useUser";

const Player = () => {
    const player = usePlayer();
    const { song } = useGetSongByid(player.activeId);
    const { user } = useUser();

    const songUrl = useLoadSongUrl(song);

    const reset = player.reset;

    useEffect(() => {
        if (!user) {
            reset();
        }
    }, [user, reset]);

    if (!user || !song || !songUrl || !player.activeId) {
        return null;
    }

    return (
        <div
            className="
            fixed
            z-40
            bottom-0
            bg-black
            w-full
            h-[75px]
            px-4
            "
        >
            <PlayerContent
                key={songUrl}
                song={song}
                songUrl={songUrl}>

            </PlayerContent>
        </div>
    );
}

export default Player;