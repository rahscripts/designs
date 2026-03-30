import Image from "next/image"

type SlideProjectProps = {
    /** 
     * Direction of the continuous slide.
     * 'left' moves right-to-left. 
     * 'right' moves left-to-right. 
     */
    direction?: "left" | "right";
};

export default function SlideProject({ direction = "right" }: SlideProjectProps) {
    const projects = [
        { name: "Can This Love Be Translated?", image: "/HeroCanLove.jpeg", link: "/canthislovebetranslated" },
        { name: 'Facebook', image: "/HeroCanLove.jpeg", link: "/canthislovebetranslated" },
        { name: 'Apple', image: "/HeroCanLove.jpeg", link: "/canthislovebetranslated" },
        { name: 'Amazon', image: "/HeroCanLove.jpeg", link: "/canthislovebetranslated" },
        { name: 'Netflix', image: "/HeroCanLove.jpeg", link: "/canthislovebetranslated" },
        { name: 'Google', image: "/HeroCanLove.jpeg", link: "/canthislovebetranslated" },
        { name: 'Microsoft', image: "/HeroCanLove.jpeg", link: "/canthislovebetranslated" },
        { name: 'Tesla', image: "/HeroCanLove.jpeg", link: "/canthislovebetranslated" },
        { name: 'SpaceX', image: "/HeroCanLove.jpeg", link: "/canthislovebetranslated" },
        { name: 'OpenAI', image: "/HeroCanLove.jpeg", link: "/canthislovebetranslated" },
    ]

    // Duplicate projects to create a seamless infinite loop.
    // Because we have 10 items taking 20vw each, 1 set equals 200vw total width.
    // Duplicating it makes it 400vw width. 
    // Translating exactly -50% shifts it smoothly to perfectly loop.
    const duplicatedProjects = [...projects, ...projects];

    return (
        <section className="overflow-hidden w-full relative py-12">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marquee-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .animate-marquee-left {
                    animation: marquee-left 40s linear infinite;
                }
                .animate-marquee-right {
                    animation: marquee-right 40s linear infinite;
                }
                .pause-on-hover:hover {
                    animation-play-state: paused;
                }
            `}} />

            <div
                className={`flex w-max ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"} pause-on-hover`}
            >
                {duplicatedProjects.map((project, index) => (
                    <div
                        className="flex-shrink-0 px-2 sm:px-3"
                        // Using '20vw' ensures exactly 5 projects fit in one horizontal page/screen width 
                        style={{ width: "20vw" }}
                        key={index}
                    >
                        {/* Premium Project Card with Image, Dark Gradient, and Smooth Hover Effects */}
                        <div className="group relative w-full aspect-[4/5] lg:aspect-video overflow-hidden rounded-xl cursor-pointer ring-1 ring-white/10 transition-all duration-300 hover:ring-white/30 ">

                            <Image
                                src={project.image}
                                alt={project.name}
                                fill
                                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                sizes="20vw"
                            />



                            {/* Project Details at the bottom layer */}


                            <h3 className="text-white text-xs sm:text-sm md:text-base lg:text-xl font-bold tracking-wide line-clamp-2 md:line-clamp-3">
                                {project.name}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}