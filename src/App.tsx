import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Layout from './components/layout/Layout';
import HtmlLangSync from './i18n/HtmlLangSync';
import ErrorBoundary from './components/common/ErrorBoundary';
import { SkeletonCard } from './components/common/Skeleton';
import { startNotificationScheduler } from './lib/notificationScheduler';
import { useSettingsStore } from './store/settingsStore';

const Home = lazy(() => import('./pages/Home'));
const Tonight = lazy(() => import('./pages/Tonight'));
const Asteroids = lazy(() => import('./pages/Asteroids'));
const Fireballs = lazy(() => import('./pages/Fireballs'));
const Meteorites = lazy(() => import('./pages/Meteorites'));
const MeteorShowers = lazy(() => import('./pages/MeteorShowers'));
const Reentry = lazy(() => import('./pages/Reentry'));
const ISSLive = lazy(() => import('./pages/ISSLive'));
const Apod = lazy(() => import('./pages/Apod'));
const EarthLive = lazy(() => import('./pages/EarthLive'));
const Education = lazy(() => import('./pages/Education'));
const About = lazy(() => import('./pages/About'));

function PageFallback() {
  return (
    <div className="space-y-4">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export default function App() {
  const notifEnabled = useSettingsStore((s) => s.notificationsEnabled);
  useEffect(() => {
    if (!notifEnabled) return;
    return startNotificationScheduler();
  }, [notifEnabled]);

  return (
    <Layout>
      <HtmlLangSync />
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tonight" element={<Tonight />} />
            <Route path="/asteroids" element={<Asteroids />} />
            <Route path="/fireballs" element={<Fireballs />} />
            <Route path="/meteorites" element={<Meteorites />} />
            <Route path="/showers" element={<MeteorShowers />} />
            <Route path="/reentry" element={<Reentry />} />
            <Route path="/iss" element={<ISSLive />} />
            <Route path="/apod" element={<Apod />} />
            <Route path="/earth" element={<EarthLive />} />
            <Route path="/education" element={<Education />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}
