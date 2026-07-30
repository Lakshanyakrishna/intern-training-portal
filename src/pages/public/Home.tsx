import Beams from '../../components/Beams';
import IntroLogo from '../../components/IntroLogo';
import Header from '../../components/Header';

export default function Home() {
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

      <div className="relative">
        {/* Page content goes here */}
      </div>
    </div>
  );
}
