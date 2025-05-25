import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import CourseList from '../../components/courses/CourseList';
import { useCourses } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import { Course } from '../../types';
import { BookOpen, BookMarked, Clock, PlayCircle, ArrowRight } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { courses, getEnrolledCourses, getWishlist } = useCourses();
  
  const enrolledCourses = getEnrolledCourses();
  const wishlist = getWishlist();
  
  // Get the enrolled course objects
  const enrolledCourseObjects = courses.filter(course => 
    enrolledCourses.some(ec => ec.courseId === course.id)
  );
  
  // Get the wishlist course objects
  const wishlistCourseObjects = courses.filter(course => 
    wishlist.includes(course.id)
  );
  
  // Get most recent enrolled course
  const mostRecentEnrolled = enrolledCourseObjects[0];
  
  // Get in-progress courses (with progress < 100%)
  const inProgressCourses = enrolledCourseObjects.filter(course => {
    const enrollment = enrolledCourses.find(ec => ec.courseId === course.id);
    return enrollment && enrollment.progress.percentage < 100;
  });

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Track your progress, continue learning, and discover new courses.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={<BookOpen className="h-6 w-6 text-blue-600" />}
              title="Enrolled Courses"
              value={enrolledCourseObjects.length}
            />
            <StatCard
              icon={<PlayCircle className="h-6 w-6 text-green-600" />}
              title="Completed Courses"
              value={
                enrolledCourseObjects.filter(course => {
                  const enrollment = enrolledCourses.find(ec => ec.courseId === course.id);
                  return enrollment && enrollment.progress.percentage === 100;
                }).length
              }
            />
            <StatCard
              icon={<BookMarked className="h-6 w-6 text-purple-600" />}
              title="Wishlist"
              value={wishlistCourseObjects.length}
            />
          </div>

          {/* Continue Learning Section */}
          {inProgressCourses.length > 0 && (
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
                <Link
                  to="/my-learning"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm"
                >
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses.slice(0, 3).map(course => {
                  const enrollment = enrolledCourses.find(ec => ec.courseId === course.id);
                  return (
                    <ContinueLearningCard
                      key={course.id}
                      course={course}
                      progress={enrollment?.progress.percentage || 0}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Wishlist Section */}
          {wishlistCourseObjects.length > 0 && (
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Wishlist</h2>
                <Link
                  to="/wishlist"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm"
                >
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <CourseList 
                courses={wishlistCourseObjects.slice(0, 3)} 
                showWishlist={true}
                showEnrollButton={true}
              />
            </div>
          )}

          {/* Recommended Courses */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recommended For You</h2>
              <Link
                to="/courses"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm"
              >
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <CourseList 
              courses={
                courses
                  .filter(course => 
                    !enrolledCourseObjects.some(ec => ec.id === course.id) && 
                    !wishlistCourseObjects.some(wc => wc.id === course.id)
                  )
                  .slice(0, 3)
              } 
              showWishlist={true}
              showEnrollButton={true}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper components
const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
}> = ({ icon, title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="ml-2 text-gray-600 font-medium">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

const ContinueLearningCard: React.FC<{
  course: Course;
  progress: number;
}> = ({ course, progress }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="h-36 overflow-hidden">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
        
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <Link
          to={`/my-learning/${course.id}`}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <PlayCircle className="mr-2 h-4 w-4" /> Continue Learning
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;