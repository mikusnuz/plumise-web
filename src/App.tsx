import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Ecosystem from "./components/Ecosystem";
import Tokenomics from "./components/Tokenomics";
import Developers from "./components/Developers";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <Navigation />
      <Hero />
      <Features />
      <Ecosystem />
      <Tokenomics />
      <Developers />
      <Footer />
    </div>
  );
}

export default App;
