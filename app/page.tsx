import Header from "./components/Header";
import Schedule from "./components/Schedule";
import FAQ from "./components/FAQ";
import Countdown from "./components/Countdown";
import About from "./components/About";
import NavBar from "./components/NavBar";
import MeetTheTeam from "./components/Team"
export default function Home() {
  return (
    <main>
      <NavBar />
      <Header />
      <Countdown />
      <About />
      <Schedule />
      <MeetTheTeam />
      <FAQ />
    </main>
  );
}