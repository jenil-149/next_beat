"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/frontend/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaMusic } from "react-icons/fa";

import Modal from "./Modal";
import Button from "./Button";
import useAddToPlaylistModal from "@/frontend/hooks/useAddToPlaylistModal";
import useCreatePlaylistModal from "@/frontend/hooks/useCreatePlaylistModal";
import { Playlist } from "@/frontend/types";

const AddToPlaylistModal = () => {
    const addToPlaylistModal = useAddToPlaylistModal();
    const createPlaylistModal = useCreatePlaylistModal();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch user playlists when the modal is opened
    useEffect(() => {
        if (!user || !addToPlaylistModal.isOpen) return;

        const fetchPlaylists = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabaseClient
                    .from("playlists")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (error) {
                    throw error;
                }
                setPlaylists(data || []);
            } catch (error) {
                toast.error((error as Error).message || "Failed to load playlists");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylists();
    }, [user, addToPlaylistModal.isOpen, supabaseClient]);

    const onChange = (open: boolean) => {
        if (!open) {
            addToPlaylistModal.onClose();
        }
    };

    const handleAddToPlaylist = async (playlistId: string) => {
        const songId = addToPlaylistModal.songId;
        if (!songId) return;

        try {
            const { error } = await supabaseClient
                .from("playlist_songs")
                .insert({
                    playlist_id: playlistId,
                    song_id: parseInt(songId, 10), // song_id is bigint, parse to integer
                });

            if (error) {
                // Check for unique key violation (Postgres error code '23505')
                if (error.code === "23505") {
                    toast.error("This song is already in the playlist.");
                    return;
                }
                throw error;
            }

            toast.success("Added to playlist!");
            addToPlaylistModal.onClose();
        } catch (error) {
            toast.error((error as Error).message || "Failed to add song to playlist");
        }
    };

    const handleCreateNewPlaylist = () => {
        addToPlaylistModal.onClose();
        createPlaylistModal.onOpen();
    };

    return (
        <Modal
            title="Add to Playlist"
            description="Choose a playlist to add this song to."
            isOpen={addToPlaylistModal.isOpen}
            onChange={onChange}
        >
            <div className="flex flex-col gap-y-4 max-h-[300px] overflow-y-auto pr-1">
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-500"></div>
                    </div>
                ) : playlists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-y-3 py-6 text-center">
                        <p className="text-neutral-400 text-sm">
                            You haven&apos;t created any playlists yet.
                        </p>
                        <Button 
                            onClick={handleCreateNewPlaylist}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 w-auto text-sm"
                        >
                            Create a Playlist
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-y-2">
                        {playlists.map((playlist) => {
                            // Resolve cover image url
                            let coverUrl = null;
                            if (playlist.image_path) {
                                const { data } = supabaseClient
                                    .storage
                                    .from("images")
                                    .getPublicUrl(playlist.image_path);
                                coverUrl = data.publicUrl;
                            }

                            return (
                                <div
                                    key={playlist.id}
                                    onClick={() => handleAddToPlaylist(playlist.id)}
                                    className="
                                        flex 
                                        items-center 
                                        gap-x-3 
                                        p-2.5 
                                        rounded-lg 
                                        bg-neutral-800/40 
                                        hover:bg-neutral-800/80 
                                        border 
                                        border-neutral-700/20 
                                        cursor-pointer 
                                        transition 
                                        duration-150
                                    "
                                >
                                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-neutral-700 flex items-center justify-center flex-shrink-0">
                                        {coverUrl ? (
                                            <Image
                                                src={coverUrl}
                                                alt={playlist.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <FaMusic className="text-neutral-400 text-xs" />
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-semibold text-white truncate">
                                            {playlist.name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AddToPlaylistModal;
