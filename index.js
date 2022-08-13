#!/usr/bin/env node

/**
 * Routes File
 */

//na

'use strict'

/* MODULE IMPORTS */
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({ multipart: true, uploadDir: '.' })
const session = require('koa-session')
const fs = require('fs-extra')
const mime = require('mime-types')
const handlebars = require('koa-hbs-renderer')
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

/* IMPORT CUSTOM MODULES */
const User = require('./modules/user')

const app = new Koa()
const router = new Router()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, { map: { handlebars: 'handlebars' } }))

const defaultPort = 8080
const port = process.env.PORT || defaultPort
const dbName = 'Domestic-Repairs.db'
const saltRounds = 10

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/', async ctx => await ctx.render('index'))


router.get('/about', async ctx => await ctx.render('about'))
router.get('/service', async ctx => await ctx.render('service'))
router.get('/MOT', async ctx => await ctx.render('MOT'))
router.get('/MOTBooking', async ctx => await ctx.render('MOTBooking'))
router.get('/F-gas', async ctx => await ctx.render('F-gas'))
router.get('/carsforsale', async ctx => await ctx.render('carsforsale'))





router.get('/addjob', async ctx => await ctx.render('addjob'))



/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */


router.post('/register', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		console.log(body)
		const { path, type } = ctx.request.files.avatar
		// call the functions in the module
		const user = await new User(dbName)
		await user.register(body.FName, body.LName, body.DateOfBirth, body.Email, body.Password)
		// await user.uploadPicture(path, type)
		// redirect to the home page
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch (err) {
		await ctx.render('error', { message: err.message })
	}
})



router.get('/login', async ctx => {
	const data = {}
	if (ctx.query.msg) data.msg = ctx.query.msg
	if (ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
})

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		await user.login(body.FName, body.Password)
		ctx.session.authorised = true
		return ctx.redirect('/?msg=you are now logged in...')
	} catch (err) {
		await ctx.render('error', { message: err.message })
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you are now logged out')
})

app.use(router.routes())
module.exports = app.listen(port, async () => console.log(`listening on port ${port}`))
