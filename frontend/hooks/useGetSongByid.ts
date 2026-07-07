import { useSessionContext } from "@supabase/auth-helpers-react";
import { Song } from "@/frontend/types";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useMemo } from "react";

const useGetSongByid = (id?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [song, setSong] = useState<Song | null>(null);
    const { supabaseClient } = useSessionContext();
    useEffect(() => {
        if (!id) {
            return;
        }
        Promise.resolve().then(() => setIsLoading(true));
        const fetchSongById = async () => {
            const { data, error } = await supabaseClient
                .from('songs')
                .select('*')
                .eq('id', id)
                .maybeSingle();

            if (error) {
                toast.error(error.message);
                setIsLoading(false);
                return;
            }
            setSong(data as Song);
            setIsLoading(false);
        }
        fetchSongById();
    }, [id, supabaseClient])
    return useMemo(() => ({
        song, isLoading
    }), [song, isLoading]);
}
export default useGetSongByid;