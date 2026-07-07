import { Song } from "@/frontend/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getLikedSongs = async (): Promise<Song[]> => {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cookies: () => cookieStore as any
    });

    const {
        data: { session }
    } = await supabase.auth.getSession();
    const { data, error } = await supabase
        .from('liked_song')
        .select('*,songs(*)')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
    if (error) {
        console.log(error.message);
        return [];
    }
    if (!data) {
        return [];
    }
    return data.map((item) => {
        return { ...item.songs }

    })

}
export default getLikedSongs;