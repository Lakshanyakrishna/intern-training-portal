import Ferrofluid from '../../components/Ferrofluid';
import IntroLogo from '../../components/IntroLogo';
import Header from '../../components/Header';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <Ferrofluid
          colors={['#9AA1A3', '#C6CAC9', '#F1F2EE']}
          speed={0.5}
          scale={1.6}
          turbulence={1}
          fluidity={0.15}
          rimWidth={0.22}
          sharpness={2.5}
          shimmer={1.2}
          glow={1.0}
          flowDirection="down"
          opacity={0.7}
          mouseInteraction
          mouseStrength={0.8}
          mouseRadius={0.35}
        />
      </div>

      <IntroLogo />
      <Header />

      <div className="relative">
        {/* Page content goes here */}
      </div>
    </div>
  );
}
