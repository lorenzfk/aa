"use client"

import { Exercise } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { motion } from "framer-motion"
import * as LucideIcons from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

interface LessonCardProps {
  skillId: string
  exercise: Exercise
  isCompleted: boolean
  isLocked: boolean
  index: number
}

export function LessonCard({ skillId, exercise, isCompleted, isLocked, index }: LessonCardProps) {
  const { 
    setCurrentExercise, 
    toggleBlenderInterface, 
    setShowLoginModal, 
    isLoggedIn, 
    setCurrentSkill,
    blenderInterfaceVisible 
  } = useAppStore()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const router = useRouter()

  const startNewLesson = () => {
    setCurrentSkill(skillId)
    setCurrentExercise(exercise.id)
    toggleBlenderInterface()
    setShowConfirmDialog(false)
  }

  const handleStartExercise = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    
    // If already in a lesson, show confirmation dialog
    if (blenderInterfaceVisible) {
      setShowConfirmDialog(true)
      return
    }
    
    startNewLesson()
  }

  // Get icon based on exercise type
  const getIcon = () => {
    switch (exercise.type) {
      case 'tutorial':
        return LucideIcons.BookOpen
      case 'quiz':
        return LucideIcons.HelpCircle
      case 'practice':
        return LucideIcons.Dumbbell
      default:
        return LucideIcons.GraduationCap
    }
  }
  
  const Icon = getIcon()
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className={isLocked ? "opacity-60" : ""}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${exercise.type === 'tutorial' ? 'bg-duolingo-blue/20' : exercise.type === 'quiz' ? 'bg-duolingo-orange/20' : 'bg-duolingo-green/20'}`}>
                  <Icon className={`h-4 w-4 ${exercise.type === 'tutorial' ? 'text-duolingo-blue' : exercise.type === 'quiz' ? 'text-duolingo-orange' : 'text-duolingo-green'}`} />
                </div>
                <CardTitle className="text-base">{exercise.title}</CardTitle>
              </div>
              {isCompleted && (
                <LucideIcons.CheckCircle2 className="h-5 w-5 text-duolingo-green" />
              )}
            </div>
            <CardDescription>{exercise.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {exercise.type === 'tutorial' ? (
                <div className="space-y-1">
                  {(exercise.content.steps as any[]).slice(0, 2).map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[10px] mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm">{step.instruction}</p>
                    </div>
                  ))}
                  {(exercise.content.steps as any[]).length > 2 && (
                    <p className="text-xs text-muted-foreground">+ {(exercise.content.steps as any[]).length - 2} more steps</p>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  {(exercise.content.objectives as string[]).slice(0, 2).map((objective, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[10px] mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm">{objective}</p>
                    </div>
                  ))}
                  {(exercise.content.objectives as string[]).length > 2 && (
                    <p className="text-xs text-muted-foreground">+ {(exercise.content.objectives as string[]).length - 2} more objectives</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleStartExercise}
              disabled={isLocked}
              className={`w-full ${isCompleted ? 'bg-duolingo-blue hover:bg-duolingo-blue/90' : 'bg-duolingo-green hover:bg-duolingo-green/90'} text-white`}
            >
              {isCompleted ? 'Practice Again' : 'Start Learning'}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch Lesson?</DialogTitle>
            <DialogDescription>
              Are you sure you want to quit your current lesson and start this one? Your progress in the current lesson will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="sm:flex-1"
            >
              Continue Current Lesson
            </Button>
            <Button
              onClick={startNewLesson}
              className="bg-duolingo-green hover:bg-duolingo-green/90 text-white sm:flex-1"
            >
              Switch Lesson
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}