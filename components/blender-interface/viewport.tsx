'use client'

import React, { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Grid, Environment } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { ChatAssistant } from "@/components/learning/chat-assistant"
import { X, ArrowLeft } from "lucide-react"
import * as THREE from "three"
import { useRouter } from "next/navigation"
import { getSkill, skills } from "@/lib/skills-data"
import { Navbar } from "@/components/layout/navbar"
import { lessonHandlers } from "@/lib/lessons/lesson-handlers"
import { confetti } from "@/lib/utils"

function CameraController() {
  const { camera, gl } = useThree()
  
  useEffect(() => {
    camera.position.set(7, 7, 7)
    camera.lookAt(0, 0, 0)
  }, [camera])
  
  return <OrbitControls 
    args={[camera, gl.domElement]} 
    enableRotate={true}
    enableZoom={true}
    enablePan={true}
    panSpeed={1.5}
    rotateSpeed={0.8}
    zoomSpeed={0.8}
    mouseButtons={{
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    }}
    touches={{
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    }}
  />
}

function Cube({ isSelected, onSelect, position, onMove }: { 
  isSelected: boolean
  onSelect: () => void
  position: THREE.Vector3
  onMove?: (newPosition: THREE.Vector3) => void
}) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [isDragging, setIsDragging] = useState(false)
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key && e.key.toLowerCase() === 'g' && isSelected && !isDragging) {
        setIsDragging(true)
      }
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && onMove) {
        const newPosition = new THREE.Vector3(
          position.x + e.movementX * 0.01,
          position.y,
          position.z + e.movementY * 0.01
        )
        onMove(newPosition)
      }
    }
    
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isSelected, isDragging, position, onMove])
  
  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={onSelect}
      onPointerOver={() => document.body.style.cursor = isDragging ? 'move' : 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#666666" metalness={0.5} roughness={0.5} />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.01, 1.01, 1.01)]} />
          <lineBasicMaterial color="#FF6B00" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  )
}

export function BlenderViewport() {
  const { 
    blenderInterfaceVisible, 
    setCurrentSkill, 
    toggleWorldMap, 
    user, 
    updateUserProgress, 
    currentSkill, 
    toggleBlenderInterface,
    setShowSignupModal 
  } = useAppStore()
  
  const [selectedCube, setSelectedCube] = useState(false)
  const [lessonComplete, setLessonComplete] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState("0:00")
  const [showChat, setShowChat] = useState(true)
  const [cubePosition, setCubePosition] = useState(new THREE.Vector3(0, 0, 0))
  const [cubeVisible, setCubeVisible] = useState(true)
  const [hasMoved, setHasMoved] = useState(false)
  const [deletePressed, setDeletePressed] = useState(false)
  const [shiftPressed, setShiftPressed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (blenderInterfaceVisible) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'auto'
      }
    }
  }, [blenderInterfaceVisible])
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (!lessonComplete) {
        const seconds = Math.floor((Date.now() - startTime) / 1000)
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        setElapsedTime(`${minutes}:${remainingSeconds.toString().padStart(2, '0')}`)
      }
    }, 1000)
    
    return () => clearInterval(timer)
  }, [startTime, lessonComplete])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        setShiftPressed(true)
      }
      if (e.key.toLowerCase() === 'x' && selectedCube) {
        setDeletePressed(true)
        setCubeVisible(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCube])

  // Lesson completion check
  useEffect(() => {
    if (!currentSkill || lessonComplete) return

    const handler = lessonHandlers[currentSkill]
    if (!handler) return

    const state = {
      selectedCube,
      deletePressed,
      hasMoved,
      shiftPressed
    }

    if (handler.checkCompletion(state)) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        setShowStats(true)
        setLessonComplete(true)
      }, 500)
    }
  }, [currentSkill, selectedCube, deletePressed, hasMoved, shiftPressed, lessonComplete])
  
  const handleContinue = () => {
    const currentSkillData = getSkill(currentSkill || 'basics-1')
    if (!currentSkillData) return

    const currentIndex = skills.findIndex(skill => skill.id === currentSkillData.id)
    const nextSkill = skills[currentIndex + 1]
    
    if (!user) {
      setShowSignupModal(true)
      setShowStats(false)
      toggleBlenderInterface()
      return
    }
    
    const updatedProgress = {
      ...user.progress,
      skills: {
        ...user.progress.skills,
        [currentSkillData.id]: {
          id: currentSkillData.id,
          level: 1,
          completed: true,
          exercises: currentSkillData.exercises.map(ex => ({
            id: ex.id,
            completed: true,
            score: 100
          }))
        }
      },
      skillPoints: user.progress.skillPoints + 20
    }
    updateUserProgress(updatedProgress)

    setShowStats(false)
    toggleBlenderInterface()
    
    if (nextSkill) {
      router.push('/learn')
      setCurrentSkill(nextSkill.id)
    } else {
      router.push('/learn')
      setCurrentSkill(null)
      toggleWorldMap()
    }
  }
  
  const handleReturnToMap = () => {
    setShowStats(false)
    toggleBlenderInterface()
    router.push('/learn')
    setCurrentSkill(null)
    toggleWorldMap()
  }
  
  if (!blenderInterfaceVisible) return null

  const showSidePanels = currentSkill !== 'basics-1' && currentSkill !== 'basics-2'
  const completedSkill = currentSkill ? getSkill(currentSkill) : null

  const getLessonMessages = () => {
    if (!currentSkill) return []
    const handler = lessonHandlers[currentSkill]
    if (!handler) return []
    
    return handler.getMessages({
      selectedCube,
      hasMoved,
      deletePressed
    })
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div 
        className="fixed inset-0 top-16 z-50 bg-blender-dark"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 flex flex-col">
          <div className="blender-toolbar h-10">
            <Button variant="ghost" size="sm" className="text-xs text-white/80 hover:text-white">File</Button>
            <Button variant="ghost" size="sm" className="text-xs text-white/80 hover:text-white">Edit</Button>
            <Button variant="ghost" size="sm" className="text-xs text-white/80 hover:text-white">View</Button>
            <Button variant="ghost" size="sm" className="text-xs text-white/80 hover:text-white">Object</Button>
            <Button variant="ghost" size="sm" className="text-xs text-white/80 hover:text-white">Help</Button>
          </div>
          
          <div className="flex flex-1">
            {showSidePanels && (
              <div className="w-14 bg-blender-dark border-r border-gray-700">
                <div className="grid grid-cols-1 gap-2 p-2">
                  {['move', 'scale', 'rotate'].map((tool) => (
                    <Button key={tool} variant="ghost" size="icon" className="h-10 w-10">
                      <span className="sr-only">{tool}</span>
                      <div className="h-5 w-5 rounded-sm bg-gray-400" />
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex-1 relative">
              <Canvas>
                <CameraController />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                {cubeVisible && currentSkill !== 'basics-1' && (
                  <Cube 
                    isSelected={selectedCube} 
                    onSelect={() => setSelectedCube(true)}
                    position={cubePosition}
                    onMove={(newPos) => {
                      setCubePosition(newPos)
                      setHasMoved(true)
                    }}
                  />
                )}
                <Grid
                  cellSize={1}
                  cellThickness={0.5}
                  cellColor="#6f6f6f"
                  sectionSize={5}
                  sectionThickness={1}
                  sectionColor="#9d4b4b"
                  fadeDistance={30}
                  fadeStrength={1}
                  followCamera={false}
                  infiniteGrid
                />
                <Environment preset="city" />
              </Canvas>
              
              <Button
                className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm"
                onClick={() => setShowChat(!showChat)}
              >
                {showChat ? "Hide" : "Show"} Assistant
              </Button>
              
              {showChat && (
                <div className="absolute bottom-4 right-4 max-w-[240px]">
                  <ChatAssistant messages={getLessonMessages()} />
                </div>
              )}
              
              {showStats && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card p-8 rounded-xl shadow-lg border max-w-md w-full mx-4"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-3xl font-bold mb-2">Lesson Complete! 🎉</h2>
                      <p className="text-lg text-muted-foreground">{completedSkill?.name || 'Basic Lesson'}</p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-muted/50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-duolingo-green">+20</div>
                          <div className="text-sm text-muted-foreground">XP Earned</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold">{elapsedTime}</div>
                          <div className="text-sm text-muted-foreground">Time</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-duolingo-yellow">100%</div>
                          <div className="text-sm text-muted-foreground">Accuracy</div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4">
                        <Button 
                          className="w-full bg-duolingo-green hover:bg-duolingo-green/90 text-white py-6 text-lg font-bold"
                          onClick={handleContinue}
                        >
                          Continue Learning
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full py-6"
                          onClick={handleReturnToMap}
                        >
                          <ArrowLeft className="w-5 h-5 mr-2" />
                          Return to World Map
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
            
            {showSidePanels && (
              <div className="w-64 bg-blender-dark border-l border-gray-700 overflow-y-auto">
                <div className="blender-panel-header">
                  Properties
                </div>
                <div className="blender-panel-content">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Location</span>
                      <div className="flex gap-1">
                        <input type="text" className="w-14 bg-blender-dark border border-gray-700 rounded px-1 py-0.5 text-xs" value={cubePosition.x.toFixed(2)} readOnly />
                        <input type="text" className="w-14 bg-blender-dark border border-gray-700 rounded px-1 py-0.5 text-xs" value={cubePosition.y.toFixed(2)} readOnly />
                        <input type="text" className="w-14 bg-blender-dark border border-gray-700 rounded px-1 py-0.5 text-xs" value={cubePosition.z.toFixed(2)} readOnly />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rotation</span>
                      <div className="flex gap-1">
                        <input type="text" className="w-14 bg-blender-dark border border-gray-700 rounded px-1 py-0.5 text-xs" value="0" readOnly />
                        <input type="text" className="w-14 bg-blender-dark border border-gray-700 rounded px-1 py-0.5 text-xs" value="0" readOnly />
                        <input type="text" className="w-14 bg-blender-dark border border-gray-700 rounded px-1 py-0.5 text-xs" value="0" readOnly />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Scale</span>
                      <div className="flex gap-1">
                        <input type="text" className="w-14 bg-blender-dark border border-gray-700 rounded px-1 py-0.5 text-xs" value="1" readOnly />
                        <input type="text" className="w-14 bg-blender-dark border border-gray-700 rounded px-1 py-0.5 text-xs" value="1" readOnly />
                        <input type="text" className="w-14 bg-blender-dark border border-gray-700 rounded px-1 py-0.5 text-xs" value="1" readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="h-6 bg-blender-dark border-t border-gray-700 flex items-center px-4 justify-between">
            <div className="text-xs text-gray-400">
              {selectedCube ? "Cube selected" : "No selection"}
            </div>
            <div className="text-xs text-gray-400">Time: {elapsedTime} | Vertices: 8 | Faces: 6 | Objects: 1</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}