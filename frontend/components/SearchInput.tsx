"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import useDebounce from "@/frontend/hooks/useDebounce";
import Input from "./Input";

const SearchInputInner = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTitle = searchParams.get("title") || "";

    const [value, setValue] = useState(currentTitle);
    const debouncedValue = useDebounce<string>(value, 500);

    useEffect(() => {
        if (debouncedValue === currentTitle) {
            return;
        }

        const query = debouncedValue ? `?title=${encodeURIComponent(debouncedValue)}` : "";
        const url = `/search${query}`;
        router.push(url);
    }, [debouncedValue, currentTitle, router]);

    return (
        <Input
            placeholder="What do you want to listen?"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
};

const SearchInput = () => {
    return (
        <Suspense fallback={<Input placeholder="What do you want to listen?" value="" onChange={() => {}} disabled />}>
            <SearchInputInner />
        </Suspense>
    );
};

export default SearchInput;