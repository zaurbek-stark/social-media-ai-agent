"use client";

import Image from "next/image";
import ContentGenerator from "./components/ContentGenerator";

export default function Home() {
  return (
    <main className="App">
      <div className="container">
        <div className="logoBox">
          <Image
            src="/logo.png"
            alt="Visualize AI logo"
            width="400"
            height="75"
          />
        </div>
        <ContentGenerator />
      </div>
    </main>
  );
}
