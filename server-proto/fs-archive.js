const fs = require('fs')
const util = require('util')
const path = require('path')
const Bluebird = require('bluebird')
const readdirAsync = util.promisify(fs.readdir)
const lstatAsync = util.promisify(fs.lstat)

const { ARCHIVE_FILES_ROOT } = process.env

class InvalidCourseNameError extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, InvalidCourseNameError)
  }
}

const lstatSafeAsync = async path => {
  try {
    return await lstatAsync(path)
  } catch (e) {
    // might have a dir to which we don't have access
    return null
  }
}
const hasStatsAndIsDir = ({ stats }) => stats !== null && stats.isDirectory()
const hasStatsAndIsFile = ({ stats }) => stats !== null && !stats.isDirectory()

const readdirWithStatsAsync = async dirPath => {
  const names = await readdirAsync(dirPath)
  const statsPromises = names.map(async name => {
    const contentPath = path.resolve(dirPath, name)
    const stats = await lstatSafeAsync(contentPath)
    return { name, stats }
  })
  return Bluebird.all(statsPromises)
}

const courseNameAndStatsToModel = ({ name, stats }) => {
  return {
    name,
    lastModified: stats.mtime && stats.mtime.toISOString()
  }
}

const getDirectoriesAsync = async dirPath => {
  const dirWithStats = await readdirWithStatsAsync(dirPath)
  return dirWithStats.filter(hasStatsAndIsDir).map(courseNameAndStatsToModel)
}

async function getCoursesAsync() {
  return getDirectoriesAsync(ARCHIVE_FILES_ROOT)
}

const getDocumentsAndStatsAsync = async dirPath => {
  const dirWithStats = await readdirWithStatsAsync(dirPath)
  return dirWithStats.filter(hasStatsAndIsFile)
}

const docNameAndStatsToModel = ({ name, stats }) => {
  return {
    filename: name,
    lastModified: stats.mtime && stats.mtime.toISOString(),
    size: stats.size
  }
}

async function getDocumentsAsync(courseName) {
  const documentsPath = path.normalize(
    path.join(ARCHIVE_FILES_ROOT, courseName)
  )

  if (documentsPath.indexOf(ARCHIVE_FILES_ROOT) !== 0) {
    throw new InvalidCourseNameError(
      'An attempt at directory traversal was made.'
    )
  }

  const documentsAndStats = await getDocumentsAndStatsAsync(documentsPath)
  return documentsAndStats.map(docNameAndStatsToModel)
}

module.exports = { getCoursesAsync, getDocumentsAsync, InvalidCourseNameError }
