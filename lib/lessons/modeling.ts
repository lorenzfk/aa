import { Lesson } from '@/lib/types';

export const modelingLesson: Lesson = {
  id: 'modeling-intro',
  messages: {
    welcome: "Welcome to Basic Modeling! Let's learn how to move objects in 3D space.",
    selectCube: "First, click on the cube to select it.",
    moveObject: "Great! Now press the 'G' key and move your mouse to reposition the cube. Click to confirm the new position.",
    complete: "Perfect! You've learned how to move objects in Blender! 🎉"
  },
  objectives: [
    'Select an object',
    'Move the object using the G key',
    'Place the object in a new position'
  ],
  checkpoints: {
    selected: false,
    moved: false
  }
};