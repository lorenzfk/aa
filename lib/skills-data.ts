import { Skill, Exercise, World } from './types';

export const worlds: World[] = [
  {
    id: 'basics',
    name: 'Basics World',
    description: 'Learn the fundamental controls and navigation',
    icon: 'layout-dashboard',
    position: { x: 0, y: 0 },
    theme: {
      primary: '#58CC02',
      secondary: '#1CB0F6'
    }
  },
  {
    id: 'modeling',
    name: 'Modeling World',
    description: 'Master object creation and manipulation',
    icon: 'cube',
    position: { x: 1, y: 0 },
    theme: {
      primary: '#FF9600',
      secondary: '#FFB84D'
    }
  },
  {
    id: 'shading',
    name: 'Materials World',
    description: 'Learn materials, textures, and shading',
    icon: 'palette',
    position: { x: 2, y: 0 },
    theme: {
      primary: '#CE82FF',
      secondary: '#DCA5FF'
    }
  }
];

export const skills: Skill[] = [
  {
    id: 'basics-1',
    name: 'Navigation Controls',
    description: 'Learn to navigate in the 3D viewport',
    icon: 'mouse-pointer',
    world: 'basics',
    exercises: [
      {
        id: 'basics-1',
        type: 'tutorial',
        title: 'Navigation Controls',
        description: 'Learn how to navigate in the 3D viewport',
        content: {
          steps: [
            { instruction: 'Middle mouse button to orbit', completed: false },
            { instruction: 'Shift + Middle mouse to pan', completed: false },
            { instruction: 'Scroll wheel to zoom', completed: false }
          ]
        },
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'basics-2',
    name: 'Selection & Deletion',
    description: 'Learn to select and delete objects',
    icon: 'trash-2',
    world: 'basics',
    exercises: [
      {
        id: 'basics-2',
        type: 'practice',
        title: 'Selection Practice',
        description: 'Practice selecting and deleting objects',
        content: {
          objectives: [
            'Select objects with right-click',
            'Delete objects with X key',
            'Confirm deletions'
          ]
        },
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'modeling-1',
    name: 'Basic Transformations',
    description: 'Move, rotate, and scale objects',
    icon: 'move',
    world: 'modeling',
    exercises: [
      {
        id: 'modeling-1',
        type: 'tutorial',
        title: 'Moving Objects',
        description: 'Learn to move objects in 3D space',
        content: {
          steps: [
            { instruction: 'Press G to grab/move', completed: false },
            { instruction: 'Press R to rotate', completed: false },
            { instruction: 'Press S to scale', completed: false }
          ]
        },
        difficulty: 'beginner'
      }
    ]
  }
];

export function getWorld(id: string): World | undefined {
  return worlds.find(world => world.id === id);
}

export function getSkill(id: string): Skill | undefined {
  return skills.find(skill => skill.id === id);
}

export function getWorldSkills(worldId: string): Skill[] {
  return skills.filter(skill => skill.world === worldId);
}

export function getExercise(skillId: string, exerciseId: string): Exercise | undefined {
  const skill = getSkill(skillId);
  if (!skill) return undefined;
  return skill.exercises.find(exercise => exercise.id === exerciseId);
}