"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Book, Brain, Cuboid, Dices, Rocket, Trophy, Users } from "lucide-react"

const features = [
  {
    title: "Learn By Doing",
    description: "Hands-on exercises teach you Blender's tools by actually using them",
    icon: Cuboid,
    color: "text-duolingo-blue"
  },
  {
    title: "Bite-sized Lessons",
    description: "Short, focused tutorials make learning manageable and fun",
    icon: Book,
    color: "text-duolingo-green"
  },
  {
    title: "Track Progress",
    description: "Visual learning path shows your journey and keeps you motivated",
    icon: Rocket,
    color: "text-duolingo-orange"
  },
  {
    title: "Gamified Learning",
    description: "Earn points, unlock achievements and maintain daily streaks",
    icon: Trophy,
    color: "text-duolingo-red"
  },
  {
    title: "Perfect for Beginners",
    description: "Start with zero experience and build skills gradually",
    icon: Brain,
    color: "text-duolingo-purple"
  },
  {
    title: "Join a Community",
    description: "Learn alongside others and share your progress",
    icon: Users,
    color: "text-duolingo-yellow"
  }
]

export function FeatureSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Learn with BlenderDuo?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our unique approach makes learning Blender engaging, accessible and effective
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-card border rounded-xl p-6 h-full flex flex-col">
                <div className={`${feature.color} bg-opacity-10 p-3 rounded-full w-fit mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 p-6 bg-card border rounded-xl max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-1">Coming Soon: Premium Subscriptions</h4>
              <p className="text-muted-foreground">
                While the basic course is free, we'll soon offer premium subscriptions with advanced lessons, downloadable project files, and personalized feedback. Start learning for free today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}