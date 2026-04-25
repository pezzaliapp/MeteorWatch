import { ReactNode } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import Footer from './Footer';
import DisclaimerBanner from './DisclaimerBanner';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="starfield flex min-h-screen flex-col">
      <Header />
      <DisclaimerBanner />
      <main className="flex-1 px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
