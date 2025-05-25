import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../../types';
import { Users, Star, BookOpen } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  isWishlisted?: boolean;
  isEnrolled?: boolean;
  onWishlist?: () => void;
  onEnroll?: () => void;
  progress?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isWishlisted,
  isEnrolled,
  onWishlist,
  onEnroll,
  progress,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-white text-sm font-medium px-2 py-1 rounded-full shadow-sm">
            {course.category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <Link to={`/courses/${course.id}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center mr-4">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.totalEnrollments} students</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span>4.8</span>
          </div>
        </div>
        
        {progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          {isEnrolled ? (
            <Link
              to={`/my-learning/${course.id}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm flex items-center justify-center transition-colors"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Continue Learning
            </Link>
          ) : (
            <>
              <button
                onClick={onEnroll}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
              >
                Enroll Now
              </button>
              {onWishlist && (
                <button
                  onClick={onWishlist}
                  className={`p-2 rounded-md border ${
                    isWishlisted
                      ? 'bg-pink-50 text-pink-600 border-pink-200'
                      : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isWishlisted ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;