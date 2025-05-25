import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { useCourses } from '../../context/CourseContext';
import CourseList from '../../components/courses/CourseList';
import { BookOpen, Users, Award, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const { courses, isLoading } = useCourses();
  
  // Get featured courses (latest 3)
  const featuredCourses = [...courses]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Discover Your Potential Through Learning
              </h1>
              <p className="text-lg text-blue-100 mb-8 max-w-lg">
                Unlock your skills with our expert-led courses. Learn at your own pace and achieve your goals.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/courses"
                  className="px-6 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors"
                >
                  Browse Courses
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <img
                src="https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg"
                alt="Learning online"
                className="rounded-lg shadow-xl w-full max-w-md object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-500">Quality Courses</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">10,000+</div>
                <div className="text-sm text-gray-500">Happy Students</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-500">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
            <Link
              to="/courses"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading courses...</p>
            </div>
          ) : (
            <CourseList courses={featuredCourses} />
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Browse by Category</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <CategoryCard
              title="Beginner"
              description="Perfect for those just starting their learning journey"
              color="bg-blue-500"
              count={courses.filter(c => c.category === 'Beginner').length}
            />
            <CategoryCard
              title="Intermediate"
              description="Take your skills to the next level with our specialized courses"
              color="bg-teal-500" 
              count={courses.filter(c => c.category === 'Average').length}
            />
            <CategoryCard
              title="Advanced"
              description="Master complex topics with our in-depth advanced courses"
              color="bg-purple-500"
              count={courses.filter(c => c.category === 'Advanced').length}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-purple-100">
            Join thousands of students who are already advancing their careers with LearnHub.
          </p>
          <Link
            to="/signup"
            className="px-8 py-3 bg-white text-purple-700 font-medium rounded-md hover:bg-purple-50 transition-colors inline-block"
          >
            Get Started For Free
          </Link>
        </div>
      </section>
    </Layout>
  );
};

const CategoryCard: React.FC<{
  title: string;
  description: string;
  color: string;
  count: number;
}> = ({ title, description, color, count }) => {
  return (
    <Link
      to={`/courses?category=${title}`}
      className="group block rounded-lg overflow-hidden shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={`${color} px-6 py-8 text-white`}>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-white/90 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{count} courses</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default HomePage;