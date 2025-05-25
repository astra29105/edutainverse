import React from 'react';
import Layout from '../../components/common/Layout';
import { useCourses } from '../../context/CourseContext';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { courses } = useCourses();

  // Calculate total enrollments
  const totalEnrollments = courses.reduce((sum, course) => sum + course.totalEnrollments, 0);

  // Mock data for analytics
  const analytics = {
    activeUsers: 1250,
    completionRate: 78,
    averageRating: 4.8,
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Courses"
              value={courses.length}
              icon={<BookOpen className="h-6 w-6 text-blue-600" />}
              trend="+12% from last month"
            />
            <StatCard
              title="Total Enrollments"
              value={totalEnrollments}
              icon={<Users className="h-6 w-6 text-green-600" />}
              trend="+18% from last month"
            />
            <StatCard
              title="Active Users"
              value={analytics.activeUsers}
              icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
              trend="+5% from last month"
            />
            <StatCard
              title="Completion Rate"
              value={`${analytics.completionRate}%`}
              icon={<Award className="h-6 w-6 text-yellow-600" />}
              trend="+3% from last month"
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <ActivityItem key={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Popular Courses */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Popular Courses</h2>
              <div className="space-y-4">
                {courses.slice(0, 5).map((course) => (
                  <CourseListItem key={course.id} course={course} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
}> = ({ title, value, icon, trend }) => (
  <div className="bg-white rounded-lg shadow px-6 py-5">
    <div className="flex items-center justify-between mb-4">
      <div className="rounded-full bg-gray-50 p-3">{icon}</div>
      <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
        {trend}
      </span>
    </div>
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
  </div>
);

const ActivityItem: React.FC = () => (
  <div className="flex items-center space-x-4">
    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
      <Users className="h-4 w-4 text-gray-600" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-900">New user enrolled in "Advanced React Patterns"</p>
      <p className="text-xs text-gray-500">2 hours ago</p>
    </div>
  </div>
);

const CourseListItem: React.FC<{ course: any }> = ({ course }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <div className="h-12 w-12 rounded-lg overflow-hidden">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
        <p className="text-xs text-gray-500">{course.totalEnrollments} enrollments</p>
      </div>
    </div>
    <div className="text-sm text-gray-500">4.9 ★</div>
  </div>
);

export default DashboardPage;