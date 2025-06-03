"use client"

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { LessonCard } from '@/components/lessons/lesson-card'
import { WorldMap } from '@/components/world-map/world-map'
import { BlenderViewport } from '@/components/blender-interface/viewport'
import { useAppStore } from '@/lib/store'
import { getSkill, skills } from '@/lib/skills-data'
import { Skill, Exercise } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trophy, Flame } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function LearnPage() {
  const { user, currentSkill, setCurrentSkill, blenderInterfaceVisible } = useAppStore()
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null)
  const router = useRouter()
  
  useEffect(() => {
    if (currentSkill) {
      const skill = getSkill(currentSkill)
      if (skill) {
        setActiveSkill(skill)
      }
    } else {
      if (!blenderInterfaceVisible) {
        setActiveSkill(skills[0])
        setCurrentSkill(skills[0].id)
      }
    }
  }, [currentSkill, setCurrentSkill, blenderInterfaceVisible])
  
  const isExerciseCompleted = (exerciseId: string): boolean => {
    if (!user) return false
    const skillProgress = user.progress.skills[activeSkill?.id ?? '']
    if (!skillProgress) return false
    const exercise = skillProgress.exercises.find(ex => ex.id === exerciseId)
    return exercise?.completed ?? false
  }
  
  const isExerciseLocked = (index: number): boolean => {
    if (!user) return index > 1
    return false
  }
  
  if (blenderInterfaceVisible) {
    return <BlenderViewport />
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {activeSkill ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setCurrentSkill(null)
                    router.push('/')
                  }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{activeSkill.name}</h1>
                  <p className="text-lg text-muted-foreground">{activeSkill.description}</p>
                </div>
              </div>
              
              {user && (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 bg-duolingo-yellow/20 px-4 py-2 rounded-full">
                    <Trophy className="h-5 w-5 text-duolingo-yellow" />
                    <span className="font-medium">{user.progress.skillPoints} XP</span>
                  </div>
                  <div className="flex items-center gap-2 bg-duolingo-orange/20 px-4 py-2 rounded-full">
                    <Flame className="h-5 w-5 text-duolingo-orange" />
                    <span className="font-medium">{user.progress.streak} day streak</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {activeSkill.exercises.map((exercise: Exercise, index) => (
                <LessonCard
                  key={exercise.id}
                  skillId={activeSkill.id}
                  exercise={exercise}
                  isCompleted={isExerciseCompleted(exercise.id)}
                  isLocked={isExerciseLocked(index)}
                  index={index}
                />
              ))}
            </div>
            
            {!user && (
              <motion.div 
                className="mt-12 p-8 bg-card border rounded-xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-3">Create an account to unlock all lessons</h3>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Sign up to save your progress, earn achievements, and access advanced lessons.
                </p>
                <Button className="bg-duolingo-green hover:bg-duolingo-green/90 text-white px-8 py-6 text-lg font-bold">
                  Create Free Account
                </Button>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-xl text-muted-foreground">Select a skill to start learning</p>
          </div>
        )}
      </div>
      
      <WorldMap />
    </div>
  )
}