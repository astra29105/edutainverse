import React from 'react';
import { Course } from '../../types';
import CourseCard from './CourseCard';
import { useCourses } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';

interface CourseListProps {
  courses: Course[];
  showWishlist?: boolean;
  showEnrollButton?: boolean;
  showProgress?: boolean;
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  showWishlist = true,
  showEnrollButton = true,
  showProgress = false,
}) => {
  const { user } = useAuth();
  const { 
    addToWishlist, 
    removeFromWishlist, 
    enrollInCourse, 
    getWishlist,
    getEnrolledCourses 
  } = useCourses();

  const wishlist = getWishlist();
  const enrolledCourses = getEnrolledCourses();
  
  const handleWishlist = (courseId: string, isWishlisted: boolean) => {
    if (isWishlisted) {
      removeFromWishlist(courseId);
    } else {
      addToWishlist(courseId);
    }
  };

  const handleEnroll = (courseId: string) => {
    enrollInCourse(courseId);
  };

  const getCourseProgress = (courseId: string) => {
    const enrolledCourse = enrolledCourses.find(ec => ec.courseId === courseId);
    return enrolledCourse?.progress.percentage || 0;
  };

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some(ec => ec.courseId === courseId);
  };

  if (courses.length === 0) {
    return (
      <div className="py-10 text-center">
        <h3 className="text-lg font-medium text-gray-500">No courses found</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          isWishlisted={showWishlist ? wishlist.includes(course.id) : undefined}
          isEnrolled={isEnrolled(course.id)}
          onWishlist={
            showWishlist && user?.role === 'student'
              ? () => handleWishlist(course.id, wishlist.includes(course.id))
              : undefined
          }
          onEnroll={
            showEnrollButton && user?.role === 'student' && !isEnrolled(course.id)
              ? () => handleEnroll(course.id)
              : undefined
          }
          progress={showProgress ? getCourseProgress(course.id) : undefined}
        />
      ))}
    </div>
  );
};

export default CourseList;