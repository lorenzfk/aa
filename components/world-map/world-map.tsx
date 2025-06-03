"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { worlds, getWorldSkills } from "@/lib/skills-data"
import { World, Skill } from "@/lib/types"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { X, Trophy, Star, Clock } from "lucide-react"
import * as LucideIcons from "lucide-react"

export function WorldMap() {
  const { worldMapOpen, toggleWorldMap, user, setCurrentSkill, toggleBlenderInterface } = useAppStore()
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  
  useEffect(() => {
    if (!worldMapOpen) {
      setSelectedWorld(null)
      setSelectedSkill(null)
    }
  }, [worldMapOpen])
  
  const getSkillProgress = (skillId: string) => {
    if (!user) return null;
    return user.progress.skills[skillId];
  }
  
  const handleStartSkill = (skill: Skill) => {
    setCurrentSkill(skill.id)
    toggleWorldMap()
    if (skill.id === 'basics-1' || skill.id === 'basics-2' || skill.id === 'modeling-1') {
      toggleBlenderInterface()
    }
  }

  const getIcon = (iconName: string) => {
    const pascalCaseIcon = iconName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('')
    const Icon = (LucideIcons as Record<string, LucideIcons.LucideIcon>)[pascalCaseIcon] || LucideIcons.HelpCircle
    return Icon
  }
  
  return (
    <AnimatePresence>
      {worldMapOpen && (
        <>
          <motion.div 
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="fixed inset-10 bg-card border rounded-xl shadow-xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="sticky top-0 flex items-center justify-between bg-card z-10 p-4 border-b">
                <h2 className="text-2xl font-bold">Learning Worlds</h2>
                <Button variant="ghost" size="icon" onClick={toggleWorldMap}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {worlds.map((world) => {
                    const WorldIcon = getIcon(world.icon)
                    const skills = getWorldSkills(world.id)
                    const completedSkills = skills.filter(skill => 
                      getSkillProgress(skill.id)?.completed
                    ).length
                    
                    return (
                      <motion.button
                        key={world.id}
                        className="group relative overflow-hidden rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedWorld(world)}
                      >
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(135deg, ${world.theme.primary}, ${world.theme.secondary})`
                          }}
                        />
                        <div className="relative p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-white/10">
                              <WorldIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-xl font-bold text-white mb-2">{world.name}</h3>
                              <p className="text-white/80 mb-4">{world.description}</p>
                              <div className="flex items-center gap-4 text-sm text-white/60">
                                <div className="flex items-center gap-1">
                                  <Trophy className="h-4 w-4" />
                                  <span>{completedSkills}/{skills.length} Skills</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <Dialog open={selectedWorld !== null} onOpenChange={(open) => !open && setSelectedWorld(null)}>
            <DialogContent className="z-[110] sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedWorld?.name}</DialogTitle>
                <DialogDescription>{selectedWorld?.description}</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {selectedWorld && getWorldSkills(selectedWorld.id).map((skill) => {
                  const progress = getSkillProgress(skill.id)
                  const SkillIcon = getIcon(skill.icon)
                  
                  return (
                    <div
                      key={skill.id}
                      className="p-4 border rounded-lg hover:bg-accent/5 cursor-pointer"
                      onClick={() => setSelectedSkill(skill)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-muted">
                          <SkillIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{skill.name}</h4>
                          <p className="text-sm text-muted-foreground">{skill.description}</p>
                        </div>
                        {progress?.completed && (
                          <Star className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={selectedSkill !== null} onOpenChange={(open) => !open && setSelectedSkill(null)}>
            <DialogContent className="z-[120] sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{selectedSkill?.name}</DialogTitle>
                <DialogDescription>{selectedSkill?.description}</DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <h4 className="font-medium mb-2">Objectives:</h4>
                <ul className="space-y-2">
                  {selectedSkill?.exercises[0].content.objectives?.map((objective: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      {objective}
                    </li>
                  ))}
                </ul>

                {getSkillProgress(selectedSkill?.id || '')?.completed && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Your Progress</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-duolingo-green" />
                        <span>Completed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>100% Score</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  onClick={() => {
                    if (selectedSkill) {
                      handleStartSkill(selectedSkill)
                    }
                  }}
                  className="w-full bg-duolingo-green hover:bg-duolingo-green/90 text-white"
                >
                  {getSkillProgress(selectedSkill?.id || '')?.completed ? 'Practice Again' : 'Start Learning'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </AnimatePresence>
  )
}