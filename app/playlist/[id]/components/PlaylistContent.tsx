"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Song, Playlist } from "@/frontend/types";
import { useUser } from "@/frontend/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { FaTrash, FaPlay } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";

import MediaItem from "@/frontend/components/MediaItem";
import LikeButton from "@/frontend/components/LikeButton";
import useOnPlay from "@/frontend/hooks/useOnPlay";

interface PlaylistContentProps {
    playlist: Playlist;
    songs: Song[];
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({ playlist, songs }) => {
    const router = useRouter();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const onPlay = useOnPlay(songs);

    const [isDeletingPlaylist, setIsDeletingPlaylist] = useState(false);
    const [removingSongId, setRemovingSongId] = useState<string | null>(null);

    const isOwner = user?.id === playlist.user_id;

    // Delete entire playlist
    const handleDeletePlaylist = async () => {
        if (!isOwner) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this playlist?");
        if (!confirmDelete) return;

        try {
            setIsDeletingPlaylist(true);

            // If playlist has a cover image, delete it from storage first
            if (playlist.image_path) {
                await supabaseClient.storage.from("images").remove([playlist.image_path]);
            }

            const { error } = await supabaseClient
                .from("playlists")
                .delete()
                .eq("id", playlist.id);

            if (error) throw error;

            toast.success("Playlist deleted");
            router.push("/");
            router.refresh();
        } catch (error) {
            toast.error((error as Error).message || "Failed to delete playlist");
        } finally {
            setIsDeletingPlaylist(false);
        }
    };

    // Remove single song from playlist
    const handleRemoveSong = async (songId: string) => {
        if (!isOwner) return;

        try {
            setRemovingSongId(songId);

            const { error } = await supabaseClient
                .from("playlist_songs")
                .delete()
                .eq("playlist_id", playlist.id)
                .eq("song_id", parseInt(songId, 10));

            if (error) throw error;

            toast.success("Song removed from playlist");
            router.refresh();
        } catch (error) {
            toast.error((error as Error).message || "Failed to remove song");
        } finally {
            setRemovingSongId(null);
        }
    };

    if (songs.length === 0) {
        return (
            <div className="flex flex-col gap-y-4 w-full px-6 text-neutral-400 py-8">
                <p>No songs in this playlist.</p>
                {isOwner && (
                    <button
                        onClick={handleDeletePlaylist}
                        disabled={isDeletingPlaylist}
                        className="
                            flex 
                            items-center 
                            gap-x-2 
                            text-red-500 
                            hover:text-red-400 
                            transition 
                            text-sm 
                            w-fit 
                            disabled:opacity-50
                        "
                    >
                        <FaTrash size={14} />
                        Delete Playlist
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-6 w-full px-6 py-6">
            {/* Playlist Controls bar */}
            <div className="flex items-center gap-x-4">
                <button
                    onClick={() => onPlay(songs[0].id.toString())}
                    className="
                        transition 
                        opacity-90 
                        hover:opacity-100 
                        rounded-full 
                        bg-yellow-400 
                        flex 
                        items-center 
                        justify-center 
                        hover:scale-105 
                        w-12 
                        h-12 
                        shadow-md
                    "
                >
                    <FaPlay className="text-black ml-1" size={18} />
                </button>
                
                {isOwner && (
                    <button
                        onClick={handleDeletePlaylist}
                        disabled={isDeletingPlaylist}
                        className="
                            flex 
                            items-center 
                            gap-x-2 
                            border 
                            border-neutral-700 
                            bg-neutral-800/40 
                            hover:bg-neutral-850 
                            hover:border-red-500/50 
                            text-neutral-400 
                            hover:text-red-500 
                            transition 
                            px-4 
                            py-2 
                            rounded-full 
                            text-xs 
                            font-semibold 
                            disabled:opacity-50
                        "
                    >
                        <FaTrash size={11} />
                        Delete Playlist
                    </button>
                )}
            </div>

            {/* Songs List */}
            <div className="flex flex-col gap-y-2 w-full">
                {songs.map((song) => (
                    <div
                        key={song.id}
                        className="
                            flex 
                            items-center 
                            gap-x-4 
                            w-full 
                            group 
                            rounded-lg 
                            hover:bg-neutral-800/30 
                            pr-2
                        "
                    >
                        <div className="flex-1">
                            <MediaItem
                                onClick={(id: string) => onPlay(id)}
                                data={song}
                            />
                        </div>
                        <div className="flex items-center gap-x-3" onClick={(e) => e.stopPropagation()}>
                            <LikeButton songID={song.id} />
                            
                            {isOwner && (
                                <button
                                    onClick={() => handleRemoveSong(song.id.toString())}
                                    disabled={removingSongId === song.id.toString()}
                                    className="
                                        text-neutral-500 
                                        hover:text-red-500 
                                        transition 
                                        disabled:opacity-50
                                    "
                                    title="Remove from playlist"
                                >
                                    <IoMdCloseCircleOutline size={22} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaylistContent;
