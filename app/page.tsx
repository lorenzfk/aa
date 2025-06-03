import { Navbar } from '@/components/layout/navbar'
import { HeroSection } from '@/components/home/hero-section'
import { FeatureSection } from '@/components/home/feature-section'
import { WorldMap } from '@/components/world-map/world-map'
import { BlenderViewport } from '@/components/blender-interface/viewport'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <WorldMap />
      <BlenderViewport />
    </main>
  );
}