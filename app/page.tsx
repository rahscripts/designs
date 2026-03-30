import SlideProject from "./components/SlideProject"


export default function Home() {
  return (
    <main>
      <SlideProject />
      <div className="p-8 min-h-screen flex items-center justify-center flex-col space-y-2">
        <h1 className="font-noto md:text-6xl text-3xl ">Designs i created for <span className="italic text-yellow-600">fun</span></h1>
        <p className="sans text-xs w-96 md:w-130 md:text-sm text-center">I love creating clean, user-friendly interfaces and contributing to open source. Recently, I started designing web UIs for the movies and series I watch. It helps me stay creative and feel productive while enjoying content.</p>
      </div>
    </main>
  );
}
