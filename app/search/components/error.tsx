"use client";
import Box from "@/frontend/components/Box";
const error = () => {
    return (
        <Box className=" h-full flex items-center justify-center bg-neutral-900">
            <div className="w-full max-w-md text-center text-neutral-400 text-2xl">Something went Wrong!</div>
        </Box>
    )
}

export default error;