"use client";
import React from "react";
import dynamic from "next/dynamic";

const AuthModal = dynamic(() => import("@/frontend/components/AuthModal"), { ssr: false });
const UploadModal = dynamic(() => import("@/frontend/components/UploadModal"), { ssr: false });
const CreatePlaylistModal = dynamic(() => import("@/frontend/components/CreatePlaylistModal"), { ssr: false });
const AddToPlaylistModal = dynamic(() => import("@/frontend/components/AddToPlaylistModal"), { ssr: false });

const ModalProvider = () => {

    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);
    if (!isMounted) {
        return null

    }

    return (
        <>
            <AuthModal />
            <UploadModal />
            <CreatePlaylistModal />
            <AddToPlaylistModal />
        </>
    );
};

export default ModalProvider;