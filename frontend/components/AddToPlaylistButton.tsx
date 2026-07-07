"use client";

import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useUser } from "@/frontend/hooks/useUser";
import useAuthModal from "@/frontend/hooks/useAuthModal";
import useAddToPlaylistModal from "@/frontend/hooks/useAddToPlaylistModal";

interface AddToPlaylistButtonProps {
    songId: string;
}

const AddToPlaylistButton: React.FC<AddToPlaylistButtonProps> = ({ songId }) => {
    const authModal = useAuthModal();
    const addToPlaylistModal = useAddToPlaylistModal();
    const { user } = useUser();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Prevent triggering player when clicking add button

        if (!user) {
            return authModal.onOpen();
        }

        addToPlaylistModal.onOpen(songId);
    };

    return (
        <button
            onClick={handleClick}
            className="
                cursor-pointer 
                hover:opacity-75 
                transition 
                text-neutral-400 
                hover:text-yellow-500 
                flex 
                items-center 
                justify-center
            "
            title="Add to Playlist"
        >
            <AiOutlinePlus className="w-[18px] h-[18px] md:w-[23px] md:h-[23px]" />
        </button>
    );
};

export default AddToPlaylistButton;
