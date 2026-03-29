import CanThisLoveBeTranslatedNavbar from "./components/CanThisLoveBeTranslatedNavbar";
import HeroSection from "./components/HeroSection";


export default function Page() {
    return (
        <div className="w-full max-w-7xl p-4 mx-auto">
            <CanThisLoveBeTranslatedNavbar />
            <HeroSection />
        </div>
    )
}