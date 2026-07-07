import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import useAuthModal from "@/frontend/hooks/useAuthModal";
import { useUser } from "@/frontend/hooks/useUser";
import useUploadModal from "@/frontend/hooks/useUploadModal";
import { Song } from "@/frontend/types";
import MediaItem from "./MediaItem";
import useOnPlay from "@/frontend/hooks/useOnPlay";

interface LibraryProps {
    songs: Song[];
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
    const authModal = useAuthModal();
    const { user } = useUser();
    const uploadModal = useUploadModal();

    const displaySongs = user ? songs : [];
    const onPlay = useOnPlay(displaySongs);

    const onClick = () => {
        // Check if user is logged in
        // If not, open auth modal
        if (!user) {
            return authModal.onOpen();
        }

        // Otherwise, open upload modal
        uploadModal.onOpen();
    }
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-5 pt-4">
                <div className="inline-flex items-center gap-x-2">
                    <TbPlaylist className="text-neutral-400" size={26} />
                    <p className="text-neutral-400 font-semibold text-md">Your Library</p>
                </div>
                <AiOutlinePlus
                    onClick={onClick}
                    size={20}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 px-3 flex-1 overflow-y-auto">
                {displaySongs.map((item) => (
                    <MediaItem
                        key={item.id}
                        data={item}
                        onClick={(id: string) => onPlay(id)}
                    />
                ))}
            </div>
        </div>
    );
};
export default Library;
