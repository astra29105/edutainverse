import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Module, Video, EnrolledCourse } from '../types';
import { useAuth } from './AuthContext';
import { generateMockCourses } from '../utils/mockData';

interface CourseContextType {
  courses: Course[];
  modules: Record<string, Module[]>;
  videos: Record<string, Video[]>;
  isLoading: boolean;
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'totalEnrollments'>) => Promise<Course>;
  updateCourse: (id: string, data: Partial<Course>) => Promise<Course>;
  deleteCourse: (id: string) => Promise<void>;
  addModule: (moduleData: Omit<Module, 'id'>) => Promise<Module>;
  updateModule: (id: string, data: Partial<Module>) => Promise<Module>;
  deleteModule: (id: string) => Promise<void>;
  addVideo: (videoData: Omit<Video, 'id'>) => Promise<Video>;
  updateVideo: (id: string, data: Partial<Video>) => Promise<Video>;
  deleteVideo: (id: string) => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  addToWishlist: (courseId: string) => Promise<void>;
  removeFromWishlist: (courseId: string) => Promise<void>;
  getEnrolledCourses: () => EnrolledCourse[];
  getWishlist: () => string[];
  updateProgress: (courseId: string, moduleId: string, videoId: string) => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Record<string, Module[]>>({});
  const [videos, setVideos] = useState<Record<string, Video[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock data
    const mockData = generateMockCourses();
    setCourses(mockData.courses);
    setModules(mockData.modules);
    setVideos(mockData.videos);
    setIsLoading(false);
  }, []);

  const addCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'totalEnrollments'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Math.random().toString(36).substring(2, 9),
      totalEnrollments: 0,
      createdAt: new Date(),
    };

    setCourses([...courses, newCourse]);
    return newCourse;
  };

  const updateCourse = async (id: string, data: Partial<Course>) => {
    const updatedCourses = courses.map(course => 
      course.id === id ? { ...course, ...data } : course
    );
    setCourses(updatedCourses);
    return updatedCourses.find(course => course.id === id) as Course;
  };

  const deleteCourse = async (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    
    // Also delete associated modules and videos
    const courseModules = modules[id] || [];
    const updatedModules = { ...modules };
    delete updatedModules[id];
    setModules(updatedModules);
    
    // Delete videos for each module
    const updatedVideos = { ...videos };
    courseModules.forEach(module => {
      delete updatedVideos[module.id];
    });
    setVideos(updatedVideos);
  };

  const addModule = async (moduleData: Omit<Module, 'id'>) => {
    const newModule: Module = {
      ...moduleData,
      id: Math.random().toString(36).substring(2, 9),
    };

    setModules(prev => {
      const courseModules = prev[moduleData.courseId] || [];
      return {
        ...prev,
        [moduleData.courseId]: [...courseModules, newModule],
      };
    });

    return newModule;
  };

  const updateModule = async (id: string, data: Partial<Module>) => {
    let updatedModule: Module | undefined;
    
    setModules(prev => {
      const result = { ...prev };
      
      Object.keys(result).forEach(courseId => {
        result[courseId] = result[courseId].map(module => {
          if (module.id === id) {
            updatedModule = { ...module, ...data };
            return updatedModule;
          }
          return module;
        });
      });
      
      return result;
    });
    
    if (!updatedModule) {
      throw new Error('Module not found');
    }
    
    return updatedModule;
  };

  const deleteModule = async (id: string) => {
    setModules(prev => {
      const result = { ...prev };
      
      Object.keys(result).forEach(courseId => {
        result[courseId] = result[courseId].filter(module => module.id !== id);
      });
      
      return result;
    });
    
    // Also delete associated videos
    setVideos(prev => {
      const result = { ...prev };
      delete result[id];
      return result;
    });
  };

  const addVideo = async (videoData: Omit<Video, 'id'>) => {
    const newVideo: Video = {
      ...videoData,
      id: Math.random().toString(36).substring(2, 9),
    };

    setVideos(prev => {
      const moduleVideos = prev[videoData.moduleId] || [];
      return {
        ...prev,
        [videoData.moduleId]: [...moduleVideos, newVideo],
      };
    });

    return newVideo;
  };

  const updateVideo = async (id: string, data: Partial<Video>) => {
    let updatedVideo: Video | undefined;
    
    setVideos(prev => {
      const result = { ...prev };
      
      Object.keys(result).forEach(moduleId => {
        result[moduleId] = result[moduleId].map(video => {
          if (video.id === id) {
            updatedVideo = { ...video, ...data };
            return updatedVideo;
          }
          return video;
        });
      });
      
      return result;
    });
    
    if (!updatedVideo) {
      throw new Error('Video not found');
    }
    
    return updatedVideo;
  };

  const deleteVideo = async (id: string) => {
    setVideos(prev => {
      const result = { ...prev };
      
      Object.keys(result).forEach(moduleId => {
        result[moduleId] = result[moduleId].filter(video => video.id !== id);
      });
      
      return result;
    });
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user || user.role !== 'student') {
      throw new Error('Only students can enroll in courses');
    }

    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      throw new Error('User not found');
    }

    const userData = JSON.parse(userJSON);
    
    // Check if already enrolled
    const alreadyEnrolled = userData.enrolledCourses?.some(
      (ec: EnrolledCourse) => ec.courseId === courseId
    );
    
    if (alreadyEnrolled) {
      return;
    }
    
    const newEnrollment: EnrolledCourse = {
      courseId,
      enrolledAt: new Date(),
      progress: {
        completedModules: [],
        lastWatchedVideo: '',
        percentage: 0,
      },
    };
    
    const updatedEnrollments = [...(userData.enrolledCourses || []), newEnrollment];
    
    const updatedUser = {
      ...userData,
      enrolledCourses: updatedEnrollments,
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Update course enrollment count
    const updatedCourse = courses.find(c => c.id === courseId);
    if (updatedCourse) {
      updateCourse(courseId, { 
        totalEnrollments: updatedCourse.totalEnrollments + 1 
      });
    }
  };

  const addToWishlist = async (courseId: string) => {
    if (!user || user.role !== 'student') {
      throw new Error('Only students can add courses to wishlist');
    }

    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      throw new Error('User not found');
    }

    const userData = JSON.parse(userJSON);
    
    if (!userData.wishlist) {
      userData.wishlist = [];
    }
    
    if (!userData.wishlist.includes(courseId)) {
      userData.wishlist.push(courseId);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const removeFromWishlist = async (courseId: string) => {
    if (!user || user.role !== 'student') {
      throw new Error('Only students can manage wishlist');
    }

    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      throw new Error('User not found');
    }

    const userData = JSON.parse(userJSON);
    
    if (userData.wishlist) {
      userData.wishlist = userData.wishlist.filter((id: string) => id !== courseId);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const getEnrolledCourses = (): EnrolledCourse[] => {
    if (!user || user.role !== 'student') {
      return [];
    }

    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      return [];
    }

    const userData = JSON.parse(userJSON);
    return userData.enrolledCourses || [];
  };

  const getWishlist = (): string[] => {
    if (!user || user.role !== 'student') {
      return [];
    }

    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      return [];
    }

    const userData = JSON.parse(userJSON);
    return userData.wishlist || [];
  };

  const updateProgress = async (courseId: string, moduleId: string, videoId: string) => {
    if (!user || user.role !== 'student') {
      throw new Error('Only students can update progress');
    }

    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      throw new Error('User not found');
    }

    const userData = JSON.parse(userJSON);
    
    if (!userData.enrolledCourses) {
      throw new Error('Not enrolled in any courses');
    }
    
    const enrolledCourseIndex = userData.enrolledCourses.findIndex(
      (ec: EnrolledCourse) => ec.courseId === courseId
    );
    
    if (enrolledCourseIndex === -1) {
      throw new Error('Not enrolled in this course');
    }
    
    const updatedEnrollments = [...userData.enrolledCourses];
    const courseEnrollment = { ...updatedEnrollments[enrolledCourseIndex] };
    
    // Update completed modules if not already marked as completed
    if (!courseEnrollment.progress.completedModules.includes(moduleId)) {
      courseEnrollment.progress.completedModules.push(moduleId);
    }
    
    // Update last watched video
    courseEnrollment.progress.lastWatchedVideo = videoId;
    
    // Recalculate progress percentage
    const courseModules = modules[courseId] || [];
    const totalModules = courseModules.length;
    const completedModules = courseEnrollment.progress.completedModules.length;
    courseEnrollment.progress.percentage = totalModules > 0
      ? Math.round((completedModules / totalModules) * 100)
      : 0;
    
    updatedEnrollments[enrolledCourseIndex] = courseEnrollment;
    
    const updatedUser = {
      ...userData,
      enrolledCourses: updatedEnrollments,
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        modules,
        videos,
        isLoading,
        addCourse,
        updateCourse,
        deleteCourse,
        addModule,
        updateModule,
        deleteModule,
        addVideo,
        updateVideo,
        deleteVideo,
        enrollInCourse,
        addToWishlist,
        removeFromWishlist,
        getEnrolledCourses,
        getWishlist,
        updateProgress,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};