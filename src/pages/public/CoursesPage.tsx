import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import CourseList from '../../components/courses/CourseList';
import { useCourses } from '../../context/CourseContext';
import { Course } from '../../types';
import { Search, Filter } from 'lucide-react';

const CoursesPage: React.FC = () => {
  const { courses, isLoading } = useCourses();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Update search params when filters change
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
    
    // Filter courses based on search term and category
    let filtered = [...courses];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        course =>
          course.title.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }
    
    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategory, courses, setSearchParams]);

  // Get unique categories from courses
  const categories = ['Beginner', 'Average', 'Advanced'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search term is already being applied via the useEffect
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Browse Our Courses</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our wide range of courses designed to help you achieve your goals and expand your knowledge.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="sm:w-64 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'Average' ? 'Intermediate' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                type="submit"
                className="sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Course List */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-500">Loading courses...</p>
              </div>
            ) : filteredCourses.length > 0 ? (
              <>
                <div className="mb-6 text-gray-600">
                  Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
                </div>
                <CourseList courses={filteredCourses} />
              </>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium text-gray-500 mb-2">No courses found</h3>
                <p className="text-gray-400">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoursesPage;