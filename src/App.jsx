import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicProvider } from "./MusicContext";
import Splash from "./pages/Splash";
import Menu from "./pages/Menu";
import Program from "./pages/Program";
import SecondDay from "./pages/SecondDay";
import MapPage from "./pages/Map";
import RSVP from "./pages/RSVP";
import Gallery from "./pages/Gallery";
import Wishes from "./pages/Wishes";
import Playlist from "./pages/Playlist";
import Challenges from "./pages/Challenges";
import DressCode from "./pages/DressCode";
import GuestsInfo from "./pages/GuestsInfo";
import Seating from "./pages/Seating";
import SeatingAdmin from "./pages/SeatingAdmin";
import BackToMenu from "./components/BackToMenu";

const withBackToMenu = (page) => (
  <>
    <BackToMenu />
    {page}
  </>
);

export default function App() {
  return (
    <MusicProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/program" element={withBackToMenu(<Program />)} />
          <Route path="/second-day" element={withBackToMenu(<SecondDay />)} />
          <Route path="/map" element={withBackToMenu(<MapPage />)} />
          <Route path="/dresscode" element={withBackToMenu(<DressCode />)} />
          <Route path="/guests" element={withBackToMenu(<GuestsInfo />)} />
          <Route path="/rsvp" element={withBackToMenu(<RSVP />)} />
          <Route path="/gallery" element={withBackToMenu(<Gallery />)} />
          <Route path="/wishes" element={withBackToMenu(<Wishes />)} />
          <Route path="/playlist" element={withBackToMenu(<Playlist />)} />
          <Route path="/challenges" element={withBackToMenu(<Challenges />)} />
          <Route path="/seating" element={withBackToMenu(<Seating />)} />
          <Route path="/seating-admin" element={<SeatingAdmin />} />
        </Routes>
      </BrowserRouter>
    </MusicProvider>
  );
}
