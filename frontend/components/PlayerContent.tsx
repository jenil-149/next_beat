"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Song } from "@/frontend/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import {
    SpeakerLoudIcon,
    SpeakerModerateIcon,
    SpeakerOffIcon,
    SpeakerQuietIcon
} from "@radix-ui/react-icons";
import usePlayer from "@/frontend/hooks/usePlayer";
import Slider from "./Slider";

interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
    const player = usePlayer();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const handleSeek = (value: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value;
            setCurrentTime(value);
        }
    };

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;

    // Play next song in queue
    const onPlayNext = useCallback(() => {
        if (player.ids.length === 0) return;

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const nextSong = player.ids[currentIndex + 1];

        if (!nextSong) {
            // Loop back to the first song
            return player.setId(player.ids[0]);
        }

        player.setId(nextSong);
    }, [player]);

    // Play previous song in queue
    const onPlayPrevious = useCallback(() => {
        if (player.ids.length === 0) return;

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const previousSong = player.ids[currentIndex - 1];

        if (!previousSong) {
            // Wrap to the last song
            return player.setId(player.ids[player.ids.length - 1]);
        }

        player.setId(previousSong);
    }, [player]);

    // Sync volume when player volume changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = player.volume;
        }
    }, [player.volume]);

    // Initialize/Update Audio element when URL changes
    useEffect(() => {
        const audio = new Audio(songUrl);
        const currentRef = audioRef;
        currentRef.current = audio;
        audio.volume = player.volume;

        // Auto play on song load
        Promise.resolve().then(() => setIsPlaying(true));
        audio.play().catch((err) => {
            if (err.name !== "AbortError") {
                console.error("Playback failed:", err);
                setIsPlaying(false);
            }
        });

        // Set initial duration if already metadata is loaded
        if (!isNaN(audio.duration)) {
            Promise.resolve().then(() => setDuration(audio.duration));
        }

        // Set up standard events
        const handleEnded = () => {
            onPlayNext();
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            audio.pause();
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            const currentCleanupRef = audioRef;
            currentCleanupRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [songUrl]);

    // Handle play/pause toggling
    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch((err) => {
                if (err.name !== "AbortError") {
                    console.error("Playback failed:", err);
                }
            });
            setIsPlaying(true);
        }
    };

    // Handle volume change
    const handleVolumeChange = (value: number) => {
        const newVolume = Math.max(0, Math.min(1, value));
        player.setVolume(newVolume);
    };

    // Toggle mute/unmute
    const toggleMute = () => {
        if (player.volume === 0) {
            handleVolumeChange(1);
        } else {
            handleVolumeChange(0);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 h-full items-center">
            {/* Info and Like Button */}
            <div className="flex justify-start w-full">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song} />
                    <LikeButton songID={song.id} />
                </div>
            </div>

            {/* Mobile Player Controls */}
            <div className="flex md:hidden col-auto w-full justify-end items-center gap-x-3">
                <AiFillStepBackward
                    onClick={onPlayPrevious}
                    size={25}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                />
                <button
                    onClick={handlePlayPause}
                    className="
                        h-10
                        w-10
                        p-1
                        rounded-full
                        bg-white
                        flex
                        items-center
                        justify-center
                        cursor-pointer
                        hover:scale-110
                        transition
                    "
                >
                    <Icon size={30} className="text-black" />
                </button>
                <AiFillStepForward
                    onClick={onPlayNext}
                    size={25}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                />
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:flex flex-col items-center justify-center w-full max-w-[722px] gap-y-1">
                <div className="flex items-center gap-x-6">
                    <AiFillStepBackward
                        onClick={onPlayPrevious}
                        size={30}
                        className="text-neutral-400 cursor-pointer hover:text-white transition"
                    />
                    <button
                        onClick={handlePlayPause}
                        className="
                            flex
                            items-center
                            justify-center
                            h-10
                            w-10
                            rounded-full
                            bg-white
                            p-1
                            cursor-pointer
                            hover:scale-110
                            transition
                        "
                    >
                        <Icon size={30} className="text-black" />
                    </button>
                    <AiFillStepForward
                        onClick={onPlayNext}
                        size={30}
                        className="text-neutral-400 cursor-pointer hover:text-white transition"
                    />
                </div>
                
                {/* Duration Slider */}
                <div className="flex items-center gap-x-3 w-full text-xs text-neutral-400 select-none">
                    <span className="w-10 text-right">{formatTime(currentTime)}</span>
                    <div className="flex-1">
                        <Slider
                            value={currentTime}
                            onChange={handleSeek}
                            max={duration || 1}
                            step={1}
                            ariaLabel="Progress"
                            className="h-5"
                        />
                    </div>
                    <span className="w-10 text-left">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Desktop Volume Slider */}
            <div className="hidden md:flex justify-end pr-2 w-full">
                <div className="flex items-center gap-x-2 w-[120px]">
                    {player.volume === 0 ? (
                        <SpeakerOffIcon
                            onClick={toggleMute}
                            className="cursor-pointer text-neutral-400 hover:text-white transition"
                            width={24}
                            height={24}
                        />
                    ) : player.volume < 0.3 ? (
                        <SpeakerQuietIcon
                            onClick={toggleMute}
                            className="cursor-pointer text-neutral-400 hover:text-white transition"
                            width={24}
                            height={24}
                        />
                    ) : player.volume < 0.7 ? (
                        <SpeakerModerateIcon
                            onClick={toggleMute}
                            className="cursor-pointer text-neutral-400 hover:text-white transition"
                            width={24}
                            height={24}
                        />
                    ) : (
                        <SpeakerLoudIcon
                            onClick={toggleMute}
                            className="cursor-pointer text-neutral-400 hover:text-white transition"
                            width={24}
                            height={24}
                        />
                    )}
                    <Slider
                        value={player.volume}
                        onChange={(value) => handleVolumeChange(value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default PlayerContent;