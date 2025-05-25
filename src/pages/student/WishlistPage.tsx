import React from 'react';
import Layout from '../../components/common/Layout';
import CourseList from '../../components/courses/CourseList';
import { useCourses } from '../../context/CourseContext';
import { BookMarked } from 'lucide-react';

const WishlistPage: React.FC = () => {
  const { courses, getWishlist } = useCourses();
  const wishlist = getWishlist();
  
  // Get the wishlist course objects
  const wishlistCourses = courses.filter(course => 
    wishlist.includes(course.id)
  );

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
              <p className="mt-1 text-sm text-gray-500">
                Courses you're interested in
              </p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <BookMarked className="h-5 w-5 mr-2" />
              <span>{wishlistCourses.length} courses</span>
            </div>
          </div>

          {wishlistCourses.length > 0 ? (
            <CourseList 
              courses={wishlistCourses}
              showWishlist={true}
              showEnrollButton={true}
            />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <BookMarked className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
              <p className="mt-1 text-sm text-gray-500">
                Save courses you're interested in for later
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

export default WishlistPage;