import { Course, Module, Video } from '../types';

export const generateMockCourses = () => {
  const courses: Course[] = [
    {
      id: 'course1',
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
      category: 'Beginner',
      thumbnailUrl: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg',
      createdBy: 'admin1',
      totalEnrollments: 128,
      createdAt: new Date('2023-03-15'),
    },
    {
      id: 'course2',
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts including hooks, context, and custom patterns.',
      category: 'Advanced',
      thumbnailUrl: 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg',
      createdBy: 'admin1',
      totalEnrollments: 86,
      createdAt: new Date('2023-05-22'),
    },
    {
      id: 'course3',
      title: 'Full Stack Development with MERN',
      description: 'Build full-stack applications with MongoDB, Express, React, and Node.js.',
      category: 'Average',
      thumbnailUrl: 'https://images.pexels.com/photos/1181290/pexels-photo-1181290.jpeg',
      createdBy: 'admin1',
      totalEnrollments: 57,
      createdAt: new Date('2023-09-05'),
    },
    {
      id: 'course4',
      title: 'UI/UX Design Principles',
      description: 'Learn fundamental design principles and how to create user-centered interfaces.',
      category: 'Beginner',
      thumbnailUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
      createdBy: 'admin1',
      totalEnrollments: 92,
      createdAt: new Date('2023-08-18'),
    },
    {
      id: 'course5',
      title: 'TypeScript for JavaScript Developers',
      description: 'Add static typing to your JavaScript projects with TypeScript.',
      category: 'Average',
      thumbnailUrl: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg',
      createdBy: 'admin1',
      totalEnrollments: 64,
      createdAt: new Date('2023-11-12'),
    },
  ];

  const modules: Record<string, Module[]> = {
    course1: [
      {
        id: 'module1',
        courseId: 'course1',
        title: 'HTML Fundamentals',
        description: 'Learn the basics of HTML markup and document structure.',
        order: 1,
      },
      {
        id: 'module2',
        courseId: 'course1',
        title: 'CSS Styling',
        description: 'Master CSS for styling web pages and creating layouts.',
        order: 2,
      },
      {
        id: 'module3',
        courseId: 'course1',
        title: 'JavaScript Basics',
        description: 'Introduction to JavaScript programming for the web.',
        order: 3,
      }
    ],
    course2: [
      {
        id: 'module4',
        courseId: 'course2',
        title: 'React Hooks in Depth',
        description: 'Master all built-in hooks and create custom hooks.',
        order: 1,
      },
      {
        id: 'module5',
        courseId: 'course2',
        title: 'Context and State Management',
        description: 'Advanced state management techniques with Context API.',
        order: 2,
      }
    ],
    course3: [
      {
        id: 'module6',
        courseId: 'course3',
        title: 'MongoDB Fundamentals',
        description: 'Learn to work with MongoDB for data storage.',
        order: 1,
      },
      {
        id: 'module7',
        courseId: 'course3',
        title: 'Express API Development',
        description: 'Build RESTful APIs with Express.js.',
        order: 2,
      },
      {
        id: 'module8',
        courseId: 'course3',
        title: 'React Frontend',
        description: 'Create a React frontend that connects to your API.',
        order: 3,
      }
    ],
    course4: [
      {
        id: 'module9',
        courseId: 'course4',
        title: 'Design Fundamentals',
        description: 'Core principles of visual design and UI.',
        order: 1,
      },
      {
        id: 'module10',
        courseId: 'course4',
        title: 'User Experience Design',
        description: 'Learn to create intuitive user experiences.',
        order: 2,
      }
    ],
    course5: [
      {
        id: 'module11',
        courseId: 'course5',
        title: 'TypeScript Basics',
        description: 'Introduction to TypeScript types and syntax.',
        order: 1,
      },
      {
        id: 'module12',
        courseId: 'course5',
        title: 'Advanced Types',
        description: 'Master advanced TypeScript type features.',
        order: 2,
      }
    ]
  };

  const videos: Record<string, Video[]> = {
    module1: [
      {
        id: 'video1',
        moduleId: 'module1',
        title: 'HTML Document Structure',
        videoUrl: 'https://example.com/videos/html-structure',
        duration: 480, // 8 minutes
        order: 1,
      },
      {
        id: 'video2',
        moduleId: 'module1',
        title: 'HTML Tags and Elements',
        videoUrl: 'https://example.com/videos/html-tags',
        duration: 720, // 12 minutes
        order: 2,
      }
    ],
    module2: [
      {
        id: 'video3',
        moduleId: 'module2',
        title: 'CSS Selectors',
        videoUrl: 'https://example.com/videos/css-selectors',
        duration: 540, // 9 minutes
        order: 1,
      },
      {
        id: 'video4',
        moduleId: 'module2',
        title: 'CSS Box Model',
        videoUrl: 'https://example.com/videos/css-box-model',
        duration: 660, // 11 minutes
        order: 2,
      }
    ],
    module3: [
      {
        id: 'video5',
        moduleId: 'module3',
        title: 'JavaScript Variables',
        videoUrl: 'https://example.com/videos/js-variables',
        duration: 420, // 7 minutes
        order: 1,
      },
      {
        id: 'video6',
        moduleId: 'module3',
        title: 'JavaScript Functions',
        videoUrl: 'https://example.com/videos/js-functions',
        duration: 780, // 13 minutes
        order: 2,
      }
    ],
    module4: [
      {
        id: 'video7',
        moduleId: 'module4',
        title: 'useState and useEffect',
        videoUrl: 'https://example.com/videos/react-hooks-basic',
        duration: 840, // 14 minutes
        order: 1,
      },
      {
        id: 'video8',
        moduleId: 'module4',
        title: 'useReducer and useContext',
        videoUrl: 'https://example.com/videos/react-hooks-advanced',
        duration: 960, // 16 minutes
        order: 2,
      }
    ],
    module5: [
      {
        id: 'video9',
        moduleId: 'module5',
        title: 'Context API Basics',
        videoUrl: 'https://example.com/videos/context-api-basics',
        duration: 600, // 10 minutes
        order: 1,
      },
      {
        id: 'video10',
        moduleId: 'module5',
        title: 'Complex State Management',
        videoUrl: 'https://example.com/videos/complex-state',
        duration: 900, // 15 minutes
        order: 2,
      }
    ],
  };

  return { courses, modules, videos };
};