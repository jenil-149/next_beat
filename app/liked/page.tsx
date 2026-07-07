
export const revalidate = 0;
import getLikedSongs from "@/backend/actions/getLikedSongs";
import Header from "@/frontend/components/Header";
import Image from "next/image";
import LikedContent from "./components/LikedContent";
const Liked = async () => {

    const songs = await getLikedSongs();
    return (
        <div className="
        bg-netural-900
        rounde-lg
        h-full
        w-full
        overflow-hidden
        overflow-y-auto
        "><Header>
                <div className="mt-20">
                    <div className="flex flex-col md:flex-row items-center gap-x-5">
                        <div className="relative 
                        h-32 w-32 lg:h-44 lg:w-44">
                            <Image
                                src='/images/liked.png'
                                alt="Playlist"
                                fill
                                className="object-cover rounded-lg"
                            />

                        </div>
                        <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
                            <p className="
                        hidden md:block
                        text-neutral-400 font-semibold text-sm">
                                Playlist
                            </p>
                            <h1 className="text-white font-bold text-4xl">
                                Liked Songs
                            </h1>
                        </div>

                    </div>

                </div>
            </Header>
            <LikedContent songs={songs} />
        </div>
    )


}
export default Liked;