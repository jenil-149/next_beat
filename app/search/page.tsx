import getSongsByTitle from "@/backend/actions/getSongsByTitle";
import Header from "@/frontend/components/Header";
import SearchInput from "@/frontend/components/SearchInput";
import SearchContent from "./components/SearchContent";
interface SearchProps {
    searchParams: Promise<{ title?: string }>
};
export const revalidate = 0;
const Search = async ({ searchParams }: SearchProps) => {
    const resolvedSearchParams = await searchParams;
    const songs = await getSongsByTitle(resolvedSearchParams.title);


    return (
        <div className="
        bg-netural-900
        rounded-lg
        w-full
        h-full
        overflow-hidden
        ">
            <Header className="
         from-netural-900
         rounded-lg
         ">
                <div className="
            mb-6
            flex
            flex-col
            gap-y-6
            ">
                    <h1
                        className="text-3xl
                font-semibold
                text-white"
                    >
                        Search
                    </h1>
                    <SearchInput />

                </div>
            </Header>
            <SearchContent songs={songs} />
        </div>
    )
};
export default Search;