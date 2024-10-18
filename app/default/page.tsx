import DefaultContentGenerator from "../components/DefaultContentGenerator";

export default function Default() {
  return (
    <main className="App">
      <div className="container flex flex-col justify-center">
        <div>
          <div className="logoBox max-w-3xl m-auto">
            <h1 className="text-foreground font-bold sm:text-5xl sm:mb-4 mb-2 text-4xl">
              Social Media AI Agent
            </h1>
            <p className="text-secondary-foreground">
              Repurpose your YouTube videos into 𝕏 and LinkedIn posts
            </p>
          </div>
          <DefaultContentGenerator />
        </div>
      </div>
    </main>
  );
}
