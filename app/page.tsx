import ContentGenerator from "./components/ContentGenerator";

export default function Home() {
  return (
    <main className="App">
      <div className="container">
        <div className="logoBox max-w-3xl m-auto">
          <h1 className="text-foreground font-bold sm:text-5xl sm:mb-4 mb-2 text-4xl">
            Social Media AI Agent
          </h1>
          <p className="text-secondary-foreground">
            Repurpose your YouTube videos into X and LinkedIn posts.
          </p>
        </div>
        <ContentGenerator />
      </div>
    </main>
  );
}
