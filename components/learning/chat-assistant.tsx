"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface Message {
  type: 'assistant'
  content: string
}

interface ChatAssistantProps {
  messages: (Message | null)[]
}

export function ChatAssistant({ messages }: ChatAssistantProps) {
  const [collapsedMessages, setCollapsedMessages] = useState<number[]>([])

  const toggleMessage = (index: number) => {
    setCollapsedMessages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {messages.map((message, index) => (
          message && (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.2 }}
              className="chat-bubble chat-bubble-assistant flex items-start gap-2 max-w-[240px]"
              style={{ fontSize: '0.875rem', padding: '0.75rem' }}
            >
              <div className="shrink-0 w-5 h-5 rounded-full bg-duolingo-blue/20 flex items-center justify-center">
                <MessageCircle className="w-3 h-3 text-duolingo-blue" />
              </div>
              <div className="flex-1">
                <motion.div
                  initial={false}
                  animate={{ height: collapsedMessages.includes(index) ? "1.5rem" : "auto" }}
                  className="overflow-hidden"
                >
                  {message.content}
                </motion.div>
              </div>
              <button
                onClick={() => toggleMessage(index)}
                className="shrink-0 w-4 h-4 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center"
              >
                {collapsedMessages.includes(index) ? (
                  <ChevronDown className="w-2 h-2" />
                ) : (
                  <ChevronUp className="w-2 h-2" />
                )}
              </button>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  )
}