import { Song } from "@/frontend/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongsByUserId = async (): Promise<Song[]> => {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cookies: () => cookieStore as any
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
        console.log(userError.message);
        return [];
    }
    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
    if (error) {
        console.log(error.message);
        return [];
    }
    return (data as Song[]) || [];

};
export default getSongsByUserId;
