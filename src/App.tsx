import { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Opening } from './sections/Opening';
import { Passage } from './sections/Passage';
import { Holdings } from './sections/Holdings';
import { Continuity } from './sections/Continuity';
import { Enterprise } from './sections/Enterprise';
import { Leadership } from './sections/Leadership';
import { NextChapter } from './sections/NextChapter';
import { ScrollTrigger } from './animations/gsap';
import { scrollToEl, startSmoothScroll } from './animations/smooth';

export default function App() {
  useEffect(() => {
    startSmoothScroll();
    // Re-measure every trigger once fonts and images have settled.
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    // Honour a hash in the address bar once layout (and the pin) exists.
    const id = location.hash.slice(1);
    if (id) {
      const el = document.getElementById(id);
      if (el) setTimeout(() => scrollToEl(el), 400);
    }
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Opening />
        <Passage />
        <Holdings />
        <Continuity />
        <Enterprise />
        <Leadership />
        <NextChapter />
      </main>
      <Footer />
    </>
  );
}
