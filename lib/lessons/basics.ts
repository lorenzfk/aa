import { Lesson } from '@/lib/types';

export const basicsLesson: Lesson = {
  id: 'basics',
  messages: {
    welcome: "Welcome to your first Blender lesson! Let's start by learning how to select and delete objects.",
    selectCube: "Try clicking on the cube to select it. You'll see an orange outline when selected.",
    deleteSelected: "Great! Now press the 'X' key to delete the selected cube.",
    complete: "Excellent work! You've completed your first lesson! 🎉"
  },
  objectives: [
    'Select an object',
    'Delete the selected object'
  ],
  checkpoints: {
    selected: false,
    deleted: false
  }
};