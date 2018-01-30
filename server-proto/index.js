const dotenv = require('dotenv')
dotenv.config()
const Koa = require('koa')
const Router = require('koa-router')
const archive = require('./fs-archive')

const app = new Koa()
const router = new Router()

router.get('/api/courses', async ctx => {
  const courses = await archive.getCoursesAsync()
  ctx.body = courses
})

router.get('/api/courses/:course', async ctx => {
  const documents = await archive.getDocumentsAsync(ctx.params.course)
  ctx.body = documents
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3005)
