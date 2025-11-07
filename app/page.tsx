import Header from "./components/Header";
import FAQ from "./components/FAQ";
import Countdown from "./components/Countdown";
import About from "./components/About";
import NavBar from "./components/NavBar";
import MeetTheTeam from "./components/Team"
import MakerspaceTraining from "./components/MakerspaceTraining";
import Footer from "./components/Footer";
import Sponsors from "./components/Sponsors";
import Judges from "./components/Judges";
import Tracks from "./components/Tracks";

export default function Home() {
  return (
    <main>
      <a 
        id="mlh-trust-badge" 
        className="fixed top-0 right-[20px] z-[10000] w-[60px] md:w-[100px]"
        href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=white"
        target="_blank">
        <img 
          src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-white.svg" 
          alt="Major League Hacking 2026 Hackathon Season" 
          style={{ width: '100%' }}
        ></img>
      </a>
      <NavBar />
      <Header />
      <Countdown />
      <About />
      <MakerspaceTraining />
      <Judges />
      <Tracks />
      <Sponsors />
      <FAQ />
      <MeetTheTeam />
    </main>
  );
}