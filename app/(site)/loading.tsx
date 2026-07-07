"use client";

import Box from "@/frontend/components/Box";
import { BounceLoader } from "react-spinners";

const Loading = () => {
    return (
        <Box className=" bg-neutral-900 h-full flex items-center justify-center">
            <BounceLoader color="#ff8000ff" size={40} />
        </Box>
    );
};

export default Loading;