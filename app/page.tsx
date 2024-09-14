import IntroScreen from "./components/IntroScreen";

export default function Home() {
  return (
    <main className="App">
      <div className="container">
        <div className="logoBox max-w-lg m-auto">
          <h1 className="text-foreground">Social Media AI Agent</h1>
          <p className="text-secondary-foreground">
            Repurpose your YouTube videos into X and LinkedIn posts. Just
            provide a link to your YouTube video, some sample X and LinkedIn
            posts for inspiriation, and watch the magic happen!
          </p>
        </div>
        <IntroScreen />
      </div>
    </main>
  );
}
