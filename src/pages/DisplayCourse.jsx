import React from 'react'
import CourseDetails from '../Components/Courses/CourseDetails'
import CourseModules from '../Components/Courses/CourseModules'
import RelatedCourses from '../Components/Courses/RelatedCourses'
import Comments from '../Components/Courses/Comments'

const DisplayCourse = () => {
  return (
    <div className ="min-h-screen bg-gray-50 py-8">
        <CourseDetails />
        <Comments />
        <RelatedCourses />
        
    </div>
  )
}

export default DisplayCourse