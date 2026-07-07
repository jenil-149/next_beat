"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/frontend/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { FaCamera, FaUserAlt, FaLock } from "react-icons/fa";
import Image from "next/image";
import uniqid from "uniqid";
import { BounceLoader } from "react-spinners";

import Input from "@/frontend/components/Input";
import Button from "@/frontend/components/Button";

const AccountContent = () => {
    const router = useRouter();
    const supabaseClient = useSupabaseClient();
    const { isLoading, user, userDetails } = useUser();

    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/");
        }
    }, [isLoading, user, router]);

    // Initialize state values when userDetails are loaded
    useEffect(() => {
        if (userDetails) {
            Promise.resolve().then(() => {
                setFullName(userDetails.full_name || "");
                if (userDetails.avatar_url) {
                    if (userDetails.avatar_url.startsWith("http")) {
                        setAvatarUrl(userDetails.avatar_url);
                    } else {
                        const { data } = supabaseClient
                            .storage
                            .from("images")
                            .getPublicUrl(userDetails.avatar_url);
                        setAvatarUrl(data.publicUrl);
                    }
                }
            });
        }
    }, [userDetails, supabaseClient]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file.");
                return;
            }
            // Max size 5MB
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image file must be under 5MB.");
                return;
            }
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleAvatarClick = () => {
        if (loading) return;
        fileInputRef.current?.click();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("Not authenticated");
            return;
        }

        if (!fullName.trim()) {
            toast.error("Full name cannot be empty");
            return;
        }

        try {
            setLoading(true);
            let avatarPath = userDetails?.avatar_url || null;

            // 1. Upload the profile picture if a new one is selected
            if (imageFile) {
                const uniqueID = uniqid();
                const fileExtension = imageFile.name.split(".").pop();
                // Store in user's subfolder in 'images' bucket: avatars/userId/avatar-uniqueid.ext
                const filePath = `avatars/${user.id}/avatar-${uniqueID}.${fileExtension}`;

                const { error: uploadError } = await supabaseClient
                    .storage
                    .from("images")
                    .upload(filePath, imageFile, {
                        cacheControl: "3600",
                        upsert: true,
                    });

                if (uploadError) {
                    throw new Error("Failed to upload profile picture. Make sure the 'images' storage bucket exists in Supabase.");
                }

                avatarPath = filePath;
            }

            // 2. Update public.users table in database
            const { error: updateError } = await supabaseClient
                .from("users")
                .update({
                    full_name: fullName,
                    avatar_url: avatarPath,
                })
                .eq("id", user.id);

            if (updateError) {
                throw updateError;
            }

            toast.success("Profile updated successfully!");
            router.refresh();

            // Reload after success to ensure useUser context fetches latest values
            setTimeout(() => {
                window.location.reload();
            }, 800);

        } catch (error) {
            toast.error((error as Error).message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-neutral-900 h-60 flex items-center justify-center">
                <BounceLoader color="#ff8000ff" size={40} />
            </div>
        );
    }

    return (
        <div className="px-6 py-8 max-w-lg mx-auto">
            <form onSubmit={handleSave} className="flex flex-col gap-y-6">
                
                {/* Profile Picture Upload Section */}
                <div className="flex flex-col items-center justify-center gap-y-3 pb-4">
                    <div 
                        onClick={handleAvatarClick}
                        className="
                            relative 
                            group 
                            w-32 
                            h-32 
                            rounded-full 
                            bg-neutral-800 
                            border-2 
                            border-neutral-700 
                            hover:border-yellow-500 
                            transition 
                            cursor-pointer 
                            overflow-hidden 
                            flex 
                            items-center 
                            justify-center
                        "
                    >
                        {previewUrl || avatarUrl ? (
                            <Image 
                                src={previewUrl || avatarUrl || ""} 
                                alt="Avatar"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <FaUserAlt className="text-neutral-500 text-4xl group-hover:opacity-30 transition" />
                        )}

                        {/* Hover Overlay */}
                        <div 
                            className="
                                absolute 
                                inset-0 
                                bg-black/60 
                                opacity-0 
                                group-hover:opacity-100 
                                flex 
                                flex-col 
                                items-center 
                                justify-center 
                                text-white 
                                text-xs 
                                font-medium 
                                transition 
                                duration-200
                            "
                        >
                            <FaCamera className="text-xl mb-1 text-yellow-500" />
                            <span>Change Photo</span>
                        </div>
                    </div>

                    <input 
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={loading}
                    />
                    
                    <p className="text-xs text-neutral-400">
                        Click on the image to upload a new profile picture.
                    </p>
                </div>

                {/* Profile Name & Read-Only Email Inputs */}
                <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-1">
                        <label className="text-sm font-semibold text-neutral-300">
                            Email Address (Read-only)
                        </label>
                        <div className="relative flex items-center">
                            <Input 
                                value={user?.email || ""} 
                                disabled 
                                className="pr-10 bg-neutral-800 border-neutral-700/60 text-neutral-400 cursor-not-allowed opacity-80"
                            />
                            <FaLock className="absolute right-4 text-neutral-500 text-sm" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="fullName" className="text-sm font-semibold text-neutral-300">
                            Full Name
                        </label>
                        <Input 
                            id="fullName"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={loading}
                            required
                            className="bg-neutral-800 border-neutral-700/60 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition"
                        />
                    </div>
                </div>

                {/* Subscription Status Card */}
                <div 
                    className="
                        bg-neutral-800/40 
                        border 
                        border-neutral-700/40 
                        backdrop-blur-md 
                        rounded-xl 
                        p-5 
                        flex 
                        flex-col 
                        gap-y-3 
                        shadow-md
                    "
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-md font-semibold text-white">
                            Subscription details
                        </h3>
                        <span 
                            className="
                                bg-yellow-500/10 
                                border 
                                border-yellow-500/30 
                                text-yellow-500 
                                text-xs 
                                font-bold 
                                px-3 
                                py-1 
                                rounded-full 
                                uppercase 
                                tracking-wider
                            "
                        >
                            Free User
                        </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                        Currently, all account features are free and there are no active subscription plans. You have full access to stream music, like songs, and upload tracks!
                    </p>
                </div>

                {/* Save Changes Button */}
                <div className="mt-4">
                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="
                            bg-yellow-500 
                            hover:bg-yellow-400 
                            text-black 
                            font-semibold 
                            py-3 
                            rounded-full 
                            w-full 
                            transition 
                            duration-200 
                            flex 
                            items-center 
                            justify-center 
                            gap-x-2 
                            shadow-lg 
                            hover:shadow-yellow-500/10
                        "
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black"></div>
                                Saving Changes...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AccountContent;
