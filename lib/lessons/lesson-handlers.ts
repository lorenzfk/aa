import { confetti } from '@/lib/utils'

export interface LessonHandler {
  id: string
  checkCompletion: (state: any) => boolean
  getMessages: (state: any) => { type: 'assistant'; content: string }[]
  onComplete?: () => void
}

export const lessonHandlers: Record<string, LessonHandler> = {
  'basics-1': {
    id: 'basics-1',
    checkCompletion: (state: { shiftPressed: boolean }) => {
      return state.shiftPressed
    },
    getMessages: () => [
      { type: 'assistant', content: "Welcome to your first Blender lesson! Let's learn how to navigate in 3D space." },
      { type: 'assistant', content: "For touchpad users:\n1. Two-finger swipe to orbit\n2. Pinch to zoom in/out\n3. Two-finger swipe while holding Shift to pan" },
      { type: 'assistant', content: "Press Shift to complete this lesson" }
    ]
  },
  'basics-2': {
    id: 'basics-2',
    checkCompletion: (state: { selectedCube: boolean; deletePressed: boolean }) => {
      return state.selectedCube && state.deletePressed
    },
    getMessages: (state: { selectedCube: boolean }) => [
      { type: 'assistant', content: "Let's learn how to select and delete objects." },
      { type: 'assistant', content: "Click on the cube to select it. You'll see an orange outline when selected." },
      state.selectedCube ? 
        { type: 'assistant', content: "Great! Now press the 'X' key to delete the selected cube." } : 
        { type: 'assistant', content: "Click the cube to select it" },
    ]
  },
  'modeling-1': {
    id: 'modeling-1',
    checkCompletion: (state: { hasMoved: boolean }) => {
      return state.hasMoved
    },
    getMessages: (state: { selectedCube: boolean; hasMoved: boolean }) => [
      { type: 'assistant', content: "Welcome to Basic Modeling! Let's learn how to move objects in 3D space." },
      { type: 'assistant', content: "First, click on the cube to select it." },
      state.selectedCube && !state.hasMoved ? 
        { type: 'assistant', content: "Great! Now press the 'G' key and move your mouse to reposition the cube. Click to confirm the new position." } :
        { type: 'assistant', content: "Select the cube to begin" },
      state.hasMoved ?
        { type: 'assistant', content: "Perfect! You've learned how to move objects in Blender! 🎉" } : null
    ].filter(Boolean)
  }
}