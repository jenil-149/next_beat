"use client";

import * as RadixSlider from "@radix-ui/react-slider";
import { twMerge } from "tailwind-merge";

interface SliderProps {
    value?: number;
    onChange?: (value: number) => void;
    max?: number;
    step?: number;
    ariaLabel?: string;
    className?: string;
}

const Slider: React.FC<SliderProps> = ({ 
    value = 1, 
    onChange,
    max = 1,
    step = 0.05,
    ariaLabel = "Volume",
    className
}) => {
    const handleChange = (newValue: number[]) => {
        onChange?.(newValue[0]);
    };

    return (
        <RadixSlider.Root
            className={twMerge(`
                relative
                flex
                items-center
                select-none
                touch-none
                w-full
                h-10
                cursor-pointer
                group
            `, className)}
            defaultValue={[1]}
            value={[value]}
            onValueChange={handleChange}
            max={max}
            step={step}
            aria-label={ariaLabel}
        >
            <RadixSlider.Track
                className="
                    bg-neutral-600
                    relative
                    grow
                    rounded-full
                    h-[3px]
                "
            >
                <RadixSlider.Range
                    className="
                        absolute
                        bg-white
                        group-hover:bg-yellow-500
                        rounded-full
                        h-full
                        transition-colors
                    "
                />
            </RadixSlider.Track>
            <RadixSlider.Thumb
                className="
                    hidden
                    group-hover:block
                    w-3
                    h-3
                    bg-white
                    rounded-full
                    shadow-md
                    focus:outline-none
                    transition-all
                    cursor-grab
                    active:cursor-grabbing
                "
            />
        </RadixSlider.Root>
    );
};

export default Slider;
