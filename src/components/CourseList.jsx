import React from 'react'
import * as R from 'ramda'
import * as classnames from 'classnames'
import { Link } from 'react-router-dom'
import './CourseList.css'

const FolderIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={classnames('folder-icon', className)}
  >
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
)

const ListingAlphabet = ({ letter }) => (
  <p className="listing-alphabet">{letter}</p>
)

const CourseListItem = ({ name, lastModified, children }) => {
  return (
    <li className="course-list-item">
      <FolderIcon className="course-list-item__icon" />
      <Link
        to={`/courses/${encodeURI(name)}`}
        className="course-list-item__link"
        title={name}
      >
        <span className="course-list-item__name">{name}</span>
      </Link>
      <p className="course-list-item__last-modified">
        {lastModified && lastModified.format('YYYY-MM-DD hh:mm')}
      </p>
      {children}
    </li>
  )
}

const CourseListHeader = () => (
  <div className="course-list-header">
    <p className="course-list-header__name">Course</p>
    <p className="course-list-header__last-modified">Last modified</p>
  </div>
)

function findFirstNamesOfStartingLetter(courseNames) {
  const firstNames = new Set()
  let previous = courseNames[0].charAt(0)
  firstNames.add(courseNames[0])

  for (const courseName of courseNames) {
    const startingLetter = courseName.charAt(0)
    if (startingLetter === previous) continue
    previous = startingLetter
    firstNames.add(courseName)
  }

  return firstNames
}

const CourseListNothingFound = ({ className }) => (
  <div className={classnames('course-list', className)}>No courses found.</div>
)

const CourseListLoading = ({ className }) => (
  <div className={classnames('course-list', className)}>Loading...</div>
)

const CourseList = ({ courses, isLoading, className }) => {
  if (isLoading) {
    return <CourseListLoading className={classnames} />
  }
  if (!courses || courses.length === 0) {
    return <CourseListNothingFound className={className} />
  }

  const firstNamesOfStartingLetter = findFirstNamesOfStartingLetter(
    R.pluck('name')(courses)
  )
  const shouldShowAlphabet = courseName =>
    firstNamesOfStartingLetter.has(courseName)

  const items = courses.map(course => (
    <CourseListItem
      className="course-list__course-list-item"
      key={course.name}
      name={course.name}
      lastModified={course.lastModified}
    >
      {/* Show alphabets to the left of the listing */
      shouldShowAlphabet(course.name) ? (
        <ListingAlphabet letter={course.name.charAt(0).toLocaleUpperCase()} />
      ) : null}
    </CourseListItem>
  ))

  return (
    <div className={classnames('course-list', className)}>
      <CourseListHeader />
      <ul className="course-list__list">{items}</ul>
    </div>
  )
}

export default CourseList
