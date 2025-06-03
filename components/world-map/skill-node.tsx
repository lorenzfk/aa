"use client"

import { Skill } from "@/lib/types"
import { cn, toPascalCase } from "@/lib/utils"
import { motion } from "framer-motion"
import * as LucideIcons from "lucide-react"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SkillNodeProps {
  skill: Skill
  status: 'locked' | 'active' | 'completed'
  onClick: () => void
  style?: React.CSSProperties
}

export function SkillNode({ skill, status, onClick, style }: SkillNodeProps) {
  // Convert kebab-case to PascalCase and get the icon
  const iconName = toPascalCase(skill.icon)
  const Icon = (LucideIcons as Record<string, LucideIcons.LucideIcon>)[iconName] || HelpCircle
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "absolute skill-node",
              status === 'locked' && "skill-node-locked",
              status === 'active' && "skill-node-active",
              status === 'completed' && "skill-node-completed"
            )}
            style={style}
            onClick={status !== 'locked' ? onClick : undefined}
            whileHover={status !== 'locked' ? { scale: 1.1 } : {}}
            whileTap={status !== 'locked' ? { scale: 0.95 } : {}}
          >
            <Icon className="h-6 w-6" />
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-bold">{skill.name}</p>
            <p className="text-xs text-muted-foreground">{skill.description}</p>
            <p className="text-xs mt-1">
              {status === 'locked' && "Complete previous skills to unlock"}
              {status === 'active' && "Ready to start!"}
              {status === 'completed' && "Completed"}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}