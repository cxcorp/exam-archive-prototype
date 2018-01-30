import React from 'react'
import * as moment from 'moment'
import CourseList from '../components/CourseList'

const apiToAppModel = courses =>
  courses.map(course => ({
    name: course.name,
    lastModified: moment(course.lastModified)
  }))

class ApiCourseList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { courses: [], shouldFetch: true, isLoading: true }
  }

  componentWillMount() {
    if (!this.state.shouldFetch) return

    this.setState({ isLoading: true })
    fetch('/api/courses')
      .then(res => res.json())
      .then(courses => {
        this.setState({
          courses: apiToAppModel(courses),
          shouldFetch: false,
          isLoading: false
        })
      })
  }

  render() {
    return (
      <CourseList
        isLoading={this.state.isLoading}
        courses={this.state.courses}
      />
    )
  }
}

export default ApiCourseList
