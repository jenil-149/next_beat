import { FaPlay } from "react-icons/fa";

const PlayButton = () => {
    return (
        <button
            className="
                transition 
                duration-300 
                opacity-0 
                rounded-full 
                flex 
                items-center 
                justify-center 
                bg-yellow-500 
                hover:bg-yellow-500 
                p-4 
                drop-shadow-md 
                translate-y-1/4 
                group-hover:opacity-100 
                group-hover:translate-y-0 
                hover:scale-110
            "
        >
            <FaPlay className="text-black" size={16} />
        </button>
    );
}
export default PlayButton;

