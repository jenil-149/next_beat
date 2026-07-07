"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/frontend/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FaPlus } from "react-icons/fa";
import { Playlist } from "@/frontend/types";
import ListItems from "@/frontend/components/ListItems";
import useCreatePlaylistModal from "@/frontend/hooks/useCreatePlaylistModal";
import useAuthModal from "@/frontend/hooks/useAuthModal";

const HomePlaylists: React.FC = () => {
    const { user, isLoading } = useUser();
    const supabaseClient = useSupabaseClient();
    const createPlaylistModal = useCreatePlaylistModal();
    const authModal = useAuthModal();
    
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        if (!user) {
            Promise.resolve().then(() => setPlaylists([]));
            return;
        }

        const fetchPlaylists = async () => {
            try {
                const { data, error } = await supabaseClient
                    .from("playlists")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (!error && data) {
                    setPlaylists(data);
                }
            } catch (error) {
                console.error("Error fetching playlists:", error);
            }
        };

        fetchPlaylists();
    }, [user, supabaseClient]);

    const handleCreateClick = () => {
        if (!user) {
            return authModal.onOpen();
        }
        createPlaylistModal.onOpen();
    };

    if (isLoading || !user) {
        return null; // Don't render playlists if loading or user is guest
    }

    return (
        <>
            {/* User Playlists */}
            {playlists.map((playlist) => {
                let coverUrl = "/images/song.png";
                if (playlist.image_path) {
                    const { data } = supabaseClient
                        .storage
                        .from("images")
                        .getPublicUrl(playlist.image_path);
                    coverUrl = data.publicUrl;
                }

                return (
                    <ListItems
                        key={playlist.id}
                        image={coverUrl}
                        name={playlist.name}
                        href={`/playlist/${playlist.id}`}
                    />
                );
            })}

            {/* Create Playlist Button Card */}
            <button
                onClick={handleCreateClick}
                className="
                    relative 
                    group 
                    flex 
                    items-center 
                    rounded-md 
                    overflow-hidden 
                    gap-x-4 
                    bg-neutral-100/5 
                    hover:bg-neutral-100/10 
                    transition 
                    pr-4 
                    cursor-pointer 
                    w-full
                    h-[64px]
                    border
                    border-dashed
                    border-neutral-700
                    hover:border-yellow-500/50
                "
            >
                <div className="flex items-center justify-center min-h-[64px] min-w-[64px] bg-neutral-800 text-neutral-400 group-hover:text-yellow-500 transition">
                    <FaPlus size={16} />
                </div>
                <p className="font-semibold text-neutral-300 group-hover:text-white transition truncate py-5">
                    Create Playlist
                </p>
            </button>
        </>
    );
};

export default HomePlaylists;
