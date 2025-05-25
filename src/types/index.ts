export interface User {
  id: string;
  role: 'student' | 'admin';
  name: string;
  email: string;
  profilePic?: string;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  wishlist: string[]; // Course IDs
  enrolledCourses: EnrolledCourse[];
}

export interface Admin extends User {
  role: 'admin';
}

export interface EnrolledCourse {
  courseId: string;
  enrolledAt: Date;
  progress: {
    completedModules: string[];
    lastWatchedVideo: string;
    percentage: number;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'Beginner' | 'Average' | 'Advanced';
  thumbnailUrl: string;
  createdBy: string; // User ID
  totalEnrollments: number;
  createdAt: Date;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
}

export interface Video {
  id: string;
  moduleId: string;
  title: string;
  videoUrl: string;
  duration: number;
  order: number;
}