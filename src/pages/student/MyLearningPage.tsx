import React from 'react';
import Layout from '../../components/common/Layout';
import CourseList from '../../components/courses/CourseList';
import { useCourses } from '../../context/CourseContext';
import { BookOpen } from 'lucide-react';

const MyLearningPage: React.FC = () => {
  const { courses, getEnrolledCourses } = useCourses();
  const enrolledCourses = getEnrolledCourses();
  
  // Get the enrolled course objects with progress
  const enrolledCourseObjects = courses.filter(course => 
    enrolledCourses.some(ec => ec.courseId === course.id)
  );

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Learning</h1>
              <p className="mt-1 text-sm text-gray-500">
                Track your progress and continue learning
              </p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <BookOpen className="h-5 w-5 mr-2" />
              <span>{enrolledCourseObjects.length} courses</span>
            </div>
          </div>

          {enrolledCourseObjects.length > 0 ? (
            <CourseList 
              courses={enrolledCourseObjects}
              showWishlist={false}
              showEnrollButton={false}
              showProgress={true}
            />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by enrolling in your first course
              </p>
              <div className="mt-6">
                <a
                  href="/courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Courses
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyLearningPage;