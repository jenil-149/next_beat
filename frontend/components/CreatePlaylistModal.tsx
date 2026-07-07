"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useUser } from "@/frontend/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import uniqid from "uniqid";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import useCreatePlaylistModal from "@/frontend/hooks/useCreatePlaylistModal";

const CreatePlaylistModal = () => {
    const createPlaylistModal = useCreatePlaylistModal();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            image: null,
        }
    });

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            createPlaylistModal.onClose();
        }
    };

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            if (!user) {
                toast.error("You must be logged in to create a playlist");
                return;
            }

            if (!values.name.trim()) {
                toast.error("Playlist name is required");
                return;
            }

            const imageFile = values.image?.[0];
            let imagePath = null;
            const uniqueID = uniqid();

            // 1. Upload playlist cover image if provided
            if (imageFile) {
                const fileExtension = imageFile.name.split(".").pop();
                const filePath = `playlists/${user.id}/cover-${uniqueID}.${fileExtension}`;

                const { data: imageData, error: imageError } = await supabaseClient
                    .storage
                    .from("images")
                    .upload(filePath, imageFile, {
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (imageError) {
                    setIsLoading(false);
                    return toast.error("Failed image upload");
                }

                imagePath = imageData.path;
            }

            // 2. Insert playlist record in database
            const { error: supabaseError } = await supabaseClient
                .from("playlists")
                .insert({
                    user_id: user.id,
                    name: values.name,
                    image_path: imagePath,
                });

            if (supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message);
            }

            router.refresh();
            setIsLoading(false);
            toast.success("Playlist created successfully!");
            reset();
            createPlaylistModal.onClose();

        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="Create Playlist"
            description="Create a custom playlist to group your favorite songs together."
            isOpen={createPlaylistModal.isOpen}
            onChange={onChange}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input
                    id="name"
                    disabled={isLoading}
                    {...register("name", { required: true })}
                    placeholder="Playlist Name"
                    required
                />
                
                <div>
                    <div className="pb-1 text-sm font-semibold text-neutral-300">
                        Select a Playlist Cover Art (Optional)
                    </div>
                    <Input
                        id="image"
                        type="file"
                        disabled={isLoading}
                        accept="image/*"
                        {...register("image")}
                    />
                </div>

                <Button type="submit" disabled={isLoading} className="mt-2">
                    {isLoading ? "Creating..." : "Create Playlist"}
                </Button>
            </form>
        </Modal>
    );
};

export default CreatePlaylistModal;
