import WatchNowBtn from "@/app/components/WatchNowBtn"

export default function CanThisLoveBeTranslatedNavbar() {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <a className="hover:text-red-500 transition-all duration-300 cursor-pointer" href="">Story</a>
                <a className="hover:text-red-500 transition-all duration-300 cursor-pointer" href="">Episodes</a>
                <a className="hover:text-red-500 transition-all duration-300 cursor-pointer" href="">Cast</a>
                <a className="hover:text-red-500 transition-all duration-300 cursor-pointer" href="">About</a>
            </div>
            <div>
                <WatchNowBtn rounded />
            </div>
        </div>
    )
}