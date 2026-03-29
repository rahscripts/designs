import Image from "next/image"

export default function HeroSection() {
    return (
        <div className="font-noto min-h-screen flex items-start justify-center my-20 md:my-30">
            <div className="space-y-10 max-md:space-y-10 w-full max-w-screen-xl px-4">

                <div className="flex flex-col items-center text-center">
                    <h1 className="text-6xl tracking-tighter max-md:text-3xl">
                        Can This Love Be <span className="text-red-600 italic">Translated?</span>
                    </h1>
                    <p className="text-sm sans md:text-lg">
                        some <span className="text-red-600 underline decoration-dashed underline-offset-2">feelings</span> don’t need words.
                    </p>
                </div>

                <div className="w-full">
                    <Image
                        src="/HeroCanLove.jpeg"
                        alt="hero"
                        width={1600}
                        height={900}
                        className="w-full rounded h-auto object-cover"
                    />
                </div>

            </div>
        </div>
    )
}