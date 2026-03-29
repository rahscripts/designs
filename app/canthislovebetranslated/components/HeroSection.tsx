import Image from "next/image"

export default function HeroSection() {
    return (
        <div className="font-noto min-h-screen flex items-start my-30 max-md:20 justify-center">
            <div className="space-y-10">
                <div className="flex flex-col items-center">
                    <h1 className="text-6xl tracking-tighter max-md:text-3xl">
                        Can This Love Be Translated?
                    </h1>
                    <p className="text-sm md:text-lg sans">
                        some feelings don’t need words.
                    </p>
                </div>
                <div>
                    <Image src="/HeroCanLove.jpeg" alt="Can This Love Be Translated" width={1600} height={900} className="w-full h-auto object-cover" />
                </div>
            </div>

        </div>
    )
}