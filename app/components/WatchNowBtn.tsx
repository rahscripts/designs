type Props = {
    rounded?: boolean,
    text?: string,
    extraClass?: string
}


export default function WatchNowBtn({ rounded, text, extraClass }: Props) {
    return (
        <button className={`bg-red-500 px-2 py-1 text-white font-semibold hover:bg-red-600 transition-all duration-300 cursor-pointer ${rounded && "rounded-md"} ${extraClass} `}>
            {text || "Watch Now"}
        </button>
    )
}