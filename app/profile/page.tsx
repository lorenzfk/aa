"use client"

import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Flame, Calendar, Award, User } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoggedIn } = useAppStore()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, router])
  
  if (!user) {
    return null
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="max-w-4xl">
          <div className="flex items-start gap-8 mb-12">
            <Avatar className="w-28 h-28">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>
                <User className="w-14 h-14" />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-4xl font-bold mb-4">{user.username}</h1>
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-duolingo-yellow/20">
                    <Trophy className="w-4 h-4 text-duolingo-yellow" />
                  </div>
                  <span className="font-medium">{user.progress.skillPoints} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-duolingo-orange/20">
                    <Flame className="w-4 h-4 text-duolingo-orange" />
                  </div>
                  <span className="font-medium">{user.progress.streak} day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-full bg-duolingo-yellow/20">
                    <Trophy className="w-5 h-5 text-duolingo-yellow" />
                  </div>
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-6">
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground font-medium">Days Active</dt>
                    <dd className="text-xl font-semibold">{user.stats.daysActive}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground font-medium">Total Points</dt>
                    <dd className="text-xl font-semibold">{user.stats.totalPoints}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground font-medium">Longest Streak</dt>
                    <dd className="text-xl font-semibold">{user.stats.longestStreak} days</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-full bg-duolingo-blue/20">
                    <Award className="w-5 h-5 text-duolingo-blue" />
                  </div>
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.stats.achievements.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">
                      Complete lessons to earn achievements!
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {user.stats.achievements.map((achievement) => (
                      <li key={achievement.id} className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-primary/10 shrink-0">
                          <Trophy className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold mb-1">{achievement.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}