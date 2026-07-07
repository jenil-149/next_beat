import getSongsByUserId from "@/backend/actions/getSongsByUserid";
import Header from "@/frontend/components/Header";
import LibraryContent from "./components/LibraryContent";

export const revalidate = 0;

const LibraryPage = async () => {
    const songs = await getSongsByUserId();

    return (
        <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
            <Header>
                <div className="mt-20">
                    <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
                        <p className="hidden md:block text-neutral-400 font-semibold text-sm">
                            Collection
                        </p>
                        <h1 className="text-white font-bold text-4xl">
                            Your Library
                        </h1>
                    </div>
                </div>
            </Header>
            <LibraryContent songs={songs} />
        </div>
    );
};

export default LibraryPage;
