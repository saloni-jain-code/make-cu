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