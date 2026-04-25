import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HtmlLangSync from './i18n/HtmlLangSync';
import Home from './pages/Home';
import Asteroids from './pages/Asteroids';
import Fireballs from './pages/Fireballs';
import Meteorites from './pages/Meteorites';
import MeteorShowers from './pages/MeteorShowers';
import Reentry from './pages/Reentry';
import ISSLive from './pages/ISSLive';
import Education from './pages/Education';
import About from './pages/About';

export default function App() {
  return (
    <Layout>
      <HtmlLangSync />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/asteroids" element={<Asteroids />} />
        <Route path="/fireballs" element={<Fireballs />} />
        <Route path="/meteorites" element={<Meteorites />} />
        <Route path="/showers" element={<MeteorShowers />} />
        <Route path="/reentry" element={<Reentry />} />
        <Route path="/iss" element={<ISSLive />} />
        <Route path="/education" element={<Education />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
