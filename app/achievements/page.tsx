"use client"

import { Navbar } from '@/components/layout/navbar'
import { Trophy, Star, Target, Calendar, Award, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'

const achievements = [
  {
    id: 'first-lesson',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: Trophy,
    color: 'text-duolingo-green',
    bgColor: 'bg-duolingo-green/20',
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Complete a lesson with 100% accuracy',
    icon: Star,
    color: 'text-duolingo-yellow',
    bgColor: 'bg-duolingo-yellow/20',
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: Target,
    color: 'text-duolingo-orange',
    bgColor: 'bg-duolingo-orange/20',
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day learning streak',
    icon: Calendar,
    color: 'text-duolingo-blue',
    bgColor: 'bg-duolingo-blue/20',
  },
  {
    id: 'all-basics',
    name: 'Basics Master',
    description: 'Complete all basic lessons',
    icon: Award,
    color: 'text-duolingo-purple',
    bgColor: 'bg-duolingo-purple/20',
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a lesson in under 2 minutes',
    icon: Zap,
    color: 'text-duolingo-red',
    bgColor: 'bg-duolingo-red/20',
  },
]

export default function AchievementsPage() {
  const { user } = useAppStore()
  const unlockedAchievements = user?.stats.achievements || []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Achievements</h1>
            <p className="text-lg text-muted-foreground">
              Track your progress and unlock special achievements as you learn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id)
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-lg border ${
                    isUnlocked ? 'bg-card' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${achievement.bgColor}`}>
                      <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{achievement.name}</h3>
                      <p className="text-muted-foreground">
                        {achievement.description}
                      </p>
                      {isUnlocked && (
                        <p className="text-sm text-duolingo-green mt-2 font-medium">
                          Unlocked!
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}