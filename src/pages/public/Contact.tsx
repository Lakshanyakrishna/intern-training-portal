import Ferrofluid from '../../components/Ferrofluid';
import IntroLogo from '../../components/IntroLogo';
import Header from '../../components/Header';

export default function Contact() {
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

      <IntroLogo animate={false} />
      <Header />

      <div className="relative flex min-h-screen items-center justify-center px-8 pt-24">
        <div className="max-w-xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight" style={{ color: '#F1F2EE' }}>
            Contact
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: '#9AA1A3' }}>
            Ways to reach the Lumora team — coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
