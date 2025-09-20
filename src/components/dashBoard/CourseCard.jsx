import React from 'react';
import { useNavigate } from 'react-router-dom';


const CourseCard = ({ course, type, onContinue, onDownloadCertificate, onReviewCourse }) => {

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const navigate = useNavigate();

  const getCategoryIcon = (category) => {
    const icons = {
      'Development': 'fas fa-code',
      'Design': 'fas fa-paint-brush',
      'Business': 'fas fa-chart-line',
      'Data Science': 'fas fa-chart-bar',
      'Marketing': 'fas fa-bullhorn',
      'Photography': 'fas fa-camera'
    };
    return icons[category] || 'fas fa-book';
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      'Development': 'from-blue-500 to-purple-600',
      'Design': 'from-pink-500 to-orange-500',
      'Business': 'from-green-500 to-teal-600',
      'Data Science': 'from-yellow-500 to-red-500',
      'Marketing': 'from-indigo-500 to-purple-600',
      'Photography': 'from-gray-500 to-gray-700'
    };
    return gradients[category] || 'from-blue-500 to-purple-600';
  };

  if (type === 'enrolled') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Course Thumbnail */}
        <div className={`h-48 bg-gradient-to-br ${getCategoryGradient(course.category)} flex items-center justify-center relative`}>
          <i className={`${getCategoryIcon(course.category)} text-5xl text-white opacity-80`}></i>
        </div>
        
        {/* Course Content */}
        <div className="p-6">
          {/* Category Badge */}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
            {course.category}
          </span>
          
          {/* Course Title and Instructor */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.course_title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            By {course.instructor_name}
          </p>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-blue-600">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Course Meta */}
          <div className="space-y-2 mb-4">
            
            <div className="flex items-center text-sm text-gray-600">
              <i className="fas fa-calendar mr-2"></i>
              <span>Last accessed: {formatDate(course.updated_at)}</span>
            </div>
          </div>
          
          {/* Continue Button */}
          <button 
            // onClick={() => onContinue(course.id)}
            onClick={() => navigate("/courses/2/content")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <i className="fas fa-play"></i>
            <span>Continue Learning</span>
          </button>
        </div>
      </div>
    );
  }

  if (type === 'completed') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
        {/* Completion Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <i className="fas fa-check mr-1"></i>
            Completed
          </span>
        </div>
        
        {/* Course Thumbnail */}
        <div className={`h-48 bg-gradient-to-br ${getCategoryGradient(course.category)} flex items-center justify-center relative`}>
          <i className={`${getCategoryIcon(course.category)} text-5xl text-white opacity-80`}></i>
        </div>
        
        {/* Course Content */}
        <div className="p-6">
          {/* Category Badge */}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
            {course.category}
          </span>
          
          {/* Course Title and Instructor */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.course_title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            By {course.instructor_name}
          </p>
          
          {/* Completion Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  <i className="fas fa-calendar mr-2"></i>
                  Completed:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(course.completion_date)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  <i className="fas fa-star mr-2"></i>
                  Score:
                </span>
                <span className="text-sm font-bold text-green-600">
                  {course.score}%
                </span>
              </div>
              
            </div>
          </div>
          
          {/* Skills Earned */}
          {course.skills && course.skills.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Skills Earned:</p>
              <div className="flex flex-wrap gap-2">
                {course.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                   {skill}
                 </span>
               ))}
               {course.skills.length > 4 && (
                 <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                   +{course.skills.length - 4} more
                 </span>
               )}
             </div>
           </div>
         )}
         
         {/* Action Buttons */}
         <div className="flex space-x-3">
           {course.hasCertificate && (
             <button 
               onClick={() => navigate(`/certificate/${course.course_id}`)}
               className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
             >
               <i className="fas fa-download"></i>
               <span>Certificate</span>
             </button>
           )}
           <button 
             onClick={() => onReviewCourse(course.course_id)}
             className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
           >
             <i className="fas fa-redo"></i>
             <span>Review</span>
           </button>
         </div>
       </div>
     </div>
   );
 }

 return null;
};

export default CourseCard;