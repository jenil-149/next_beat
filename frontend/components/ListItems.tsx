"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import { FaPlay } from "react-icons/fa";

interface ListItemsProps {
    image: string;
    name: string;
    href: string;
    priority?: boolean;
}

const ListItems: React.FC<ListItemsProps> = ({ image, name, href, priority }) => {
    const router = useRouter();

    const onClick = () => {
        // Add authentication check here later
        router.push(href);
    };

    return (
        <button
            onClick={onClick}
            className="
                relative 
                group 
                flex 
                items-center 
                rounded-md 
                overflow-hidden 
                gap-x-4 
                bg-neutral-100/10 
                hover:bg-neutral-100/20 
                transition 
                pr-4 
                cursor-pointer 
                w-full
            "
        >
            <div className="relative min-h-[64px] min-w-[64px] bg-neutral-900">
                <Image
                    fill
                    src={image}
                    alt={name}
                    className="object-cover"
                    sizes="64px"
                    priority={priority}
                />
            </div>
            <p className="font-semibold truncate py-5 text-white">
                {name}
            </p>
            <div
                className="
                    absolute 
                    transition 
                    opacity-0 
                    rounded-full 
                    flex 
                    items-center 
                    justify-center 
                    bg-yellow-400 
                    p-3 
                    drop-shadow-md 
                    right-5 
                    group-hover:opacity-100 
                    hover:scale-110
                "
            >
                <FaPlay className="text-black" size={12} />
            </div>
        </button>
    );
};

export default ListItems;