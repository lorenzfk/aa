"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { ArrowRight } from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, OrbitControls, Environment } from "@react-three/drei"
import { Suspense } from "react"

function BlenderCube() {
  return (
    <mesh rotation={[0, Math.PI / 4, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#666666" metalness={0.5} roughness={0.5} />
    </mesh>
  )
}

function Donut() {
  return (
    <mesh position={[3, 0, -1]} rotation={[Math.PI / 6, 0, 0]}>
      <torusGeometry args={[1, 0.4, 16, 32]} />
      <meshStandardMaterial color="#FF9600" />
    </mesh>
  )
}

function Suzanne() {
  return (
    <mesh position={[-3, 0, -1]} rotation={[0, Math.PI / 4, 0]}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial color="#58CC02" roughness={0.5} metalness={0.2} />
    </mesh>
  )
}

export function HeroSection() {
  const { isLoggedIn, setShowSignupModal, setCurrentSkill, toggleBlenderInterface } = useAppStore()
  
  const startFirstLesson = () => {
    setCurrentSkill('basics-1')
    toggleBlenderInterface()
  }
  
  return (
    <div className="relative overflow-hidden min-h-[85vh]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 z-10" />
      
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          
          <Suspense fallback={null}>
            <BlenderCube />
            <Donut />
            <Suzanne />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Content */}
      <div className="container relative z-20">
        <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              Learn <span className="text-duolingo-blue">Blender</span> in 3D,{" "}
              <span className="text-duolingo-green">one skill</span> at a time
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Master 3D modeling through bite-sized, gamified lessons. 
              The fun way to learn Blender - no experience required.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="space-x-4"
          >
            <Button 
              size="lg" 
              className="bg-duolingo-green hover:bg-duolingo-green/90 text-white font-bold px-8"
              onClick={startFirstLesson}
            >
              Try Your First Lesson
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}