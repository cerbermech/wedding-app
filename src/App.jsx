import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Menu from "./pages/Menu";
import Program from "./pages/Program";
import MapPage from "./pages/Map";
import RSVP from "./pages/RSVP";
import Gallery from "./pages/Gallery";
import Wishes from "./pages/Wishes";
import Capsule from "./pages/Capsule";
import Playlist from "./pages/Playlist";
import Сhallenges from "./pages/Challenges";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/program" element={<Program />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/rsvp" element={<RSVP />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/wishes" element={<Wishes />} />
        <Route path="/capsule" element={<Capsule />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/challenges" element={<Сhallenges />} />

      </Routes>
    </BrowserRouter>
  );
}