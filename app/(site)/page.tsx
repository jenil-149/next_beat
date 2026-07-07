import Header from "@/frontend/components/Header";
import React from "react";
import ListItems from "@/frontend/components/ListItems";
import PageContents from "./components/PageContents";
import HomePlaylists from "./components/HomePlaylists";
import getSongs from "@/backend/actions/getSongs";

export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();

  return (
    <div className="w-full h-full overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">Welcome back</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItems
              image="/images/liked.png"
              name="Liked Songs"
              href="liked"
              priority
            />
            <HomePlaylists />
          </div>
        </div>
      </Header>
      <div className="mt-6 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">Newest Songs</h1>
        </div>
        <PageContents songs={songs} />
      </div>
    </div>
  );
}
