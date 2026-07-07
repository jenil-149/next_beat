import { Song } from "@/frontend/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getSongs from "./getSongs";

const getSongsByTitle = async (title?: string): Promise<Song[]> => {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cookies: () => cookieStore as any
    });

    if (!title) {
        const allSongs = await getSongs();
        return allSongs;
    }

    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .ilike('title', `%${title}%`)
        .order('created_at', { ascending: false })
    if (error) {
        console.log(error.message);
        return [];
    }
    return (data as Song[]) || [];

}
export default getSongsByTitle;