import { create } from "zustand";

interface AddToPlaylistModalStore {
    isOpen: boolean;
    songId?: string;
    onOpen: (songId: string) => void;
    onClose: () => void;
}

const useAddToPlaylistModal = create<AddToPlaylistModalStore>((set) => ({
    isOpen: false,
    songId: undefined,
    onOpen: (songId: string) => set({ isOpen: true, songId }),
    onClose: () => set({ isOpen: false, songId: undefined }),
}));

export default useAddToPlaylistModal;
