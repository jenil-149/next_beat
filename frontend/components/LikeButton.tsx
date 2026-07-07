"use client";

import { useUser } from "@/frontend/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuthModal from "@/frontend/hooks/useAuthModal";
import { toast } from "react-hot-toast";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"

interface LikeButtonProps {
    songID: string;
}
const LikeButton: React.FC<LikeButtonProps> = ({ songID }) => {
    const router = useRouter();
    const { supabaseClient } = useSessionContext();
    const authModal = useAuthModal();
    const { user } = useUser();

    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!user?.id) {
            Promise.resolve().then(() => setIsLiked(false));
            return;
        }
        const fetchLikedSongs = async () => {
            const { data, error } = await supabaseClient
                .from('liked_song')
                .select('*')
                .eq('user_id', user.id)
                .eq('song_id', songID)
                .maybeSingle();

            if (!error && data) {
                setIsLiked(true);
            }
        }
        fetchLikedSongs();
    }, [songID, supabaseClient, user?.id]);

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart;
    const handleLike = async () => {
        if (!user) {
            return authModal.onOpen();
        }

        setIsLoading(true);

        if (isLiked) {
            const { error } = await supabaseClient
                .from('liked_song')
                .delete()
                .eq('user_id', user.id)
                .eq('song_id', songID);

            if (error) {
                toast.error(error.message);
            } else {
                setIsLiked(false);
                toast.success('Removed from liked songs');
            }
        } else {
            const { error } = await supabaseClient
                .from('liked_song')
                .insert({
                    user_id: user.id,
                    song_id: songID
                });

            if (error) {
                toast.error(error.message);
            } else {
                setIsLiked(true);
                toast.success('Added to liked songs');
            }
        }

        setIsLoading(false);
        router.refresh();
    }

    return (
        <button
            disabled={isLoading}
            onClick={handleLike}
            className="cursor-pointer hover:opacity-75 transition flex items-center justify-center"
        >
            <Icon 
                color={isLiked ? '#ff4400ff' : 'white'} 
                className="w-[18px] h-[18px] md:w-[25px] md:h-[25px]"
            />
        </button>
    );
}
export default LikeButton;