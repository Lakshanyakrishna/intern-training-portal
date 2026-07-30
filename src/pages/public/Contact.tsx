import Beams from '../../components/Beams';
import IntroLogo from '../../components/IntroLogo';
import Header from '../../components/Header';

export default function Contact() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#9AA1A3"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>

      <IntroLogo />
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
