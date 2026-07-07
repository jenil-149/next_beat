import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import { FaMusic } from "react-icons/fa";

import Header from "@/frontend/components/Header";
import PlaylistContent from "./components/PlaylistContent";
import { Song, Playlist } from "@/frontend/types";

export const revalidate = 0;

interface PlaylistProps {
    params: Promise<{
        id: string;
    }>;
}

const PlaylistPage = async ({ params }: PlaylistProps) => {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cookies: () => cookieStore as any
    });

    // 1. Fetch Playlist Info
    const { data: playlistData, error: playlistError } = await supabase
        .from("playlists")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (playlistError || !playlistData) {
        return (
            <div className="bg-neutral-900 h-full w-full flex items-center justify-center text-neutral-400">
                Playlist not found.
            </div>
        );
    }

    const playlist = playlistData as Playlist;

    // 2. Fetch Songs in the Playlist
    const { data: songsData } = await supabase
        .from("playlist_songs")
        .select("songs(*)")
        .eq("playlist_id", id)
        .order("created_at", { ascending: true });

    // Map join table result to Song[] array
    const songs: Song[] = (songsData?.map((item) => (item as unknown as { songs: Song | null }).songs).filter(Boolean) as Song[]) || [];

    // 3. Resolve Playlist cover URL
    let coverUrl = null;
    if (playlist.image_path) {
        const { data } = supabase.storage.from("images").getPublicUrl(playlist.image_path);
        coverUrl = data.publicUrl;
    }

    return (
        <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
            <Header>
                <div className="mt-20">
                    <div className="flex flex-col md:flex-row items-center gap-x-5">
                        <div className="relative h-32 w-32 lg:h-44 lg:w-44 bg-neutral-800 flex items-center justify-center rounded-lg overflow-hidden shadow-lg border border-neutral-700/50">
                            {coverUrl ? (
                                <Image
                                    src={coverUrl}
                                    alt={playlist.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <FaMusic className="text-neutral-500 text-5xl" />
                            )}
                        </div>
                        <div className="flex flex-col gap-y-2 mt-4 md:mt-0 text-center md:text-left">
                            <p className="hidden md:block text-neutral-400 font-semibold text-sm">
                                Playlist
                            </p>
                            <h1 className="text-white font-bold text-4xl lg:text-5xl truncate max-w-xl">
                                {playlist.name}
                            </h1>
                            <p className="text-neutral-400 text-xs mt-1">
                                {songs.length} {songs.length === 1 ? "song" : "songs"}
                            </p>
                        </div>
                    </div>
                </div>
            </Header>
            <PlaylistContent playlist={playlist} songs={songs} />
        </div>
    );
};

export default PlaylistPage;
