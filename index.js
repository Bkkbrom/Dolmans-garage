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
router.get('/MOT', async ctx => await ctx.render('MOT', { MOTImag: 'about' }))


router.get('/MOTBooking', async ctx => await ctx.render('MOTBooking'))
router.get('/F-gas', async ctx => await ctx.render('F-gas'))
router.get('/carsforsale', async ctx => await ctx.render('carsforsale'))


app.use(router.routes())
module.exports = app.listen(port, async () => console.log(`listening on port ${port}`))
