import React from 'react'
import CourseDetails from '../components/courses/CourseDetails'
import CourseModules from '../components/courses/CourseModules'
import RelatedCourses from '../components/courses/RelatedCourses'
import Comments from '../components/courses/Comments'

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