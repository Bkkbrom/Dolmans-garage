
'use strict'

//const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
//const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS Customer (CustomerID INTEGER PRIMARY KEY AUTOINCREMENT, CustomerFName TEXT, CustomerLName TEXT, CustomerDOB DATE, CustomerEmail TEXT,pass TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	async register(CustomerFName, CustomerLName, CustomerDOB, CustomerEmail, pass) {
		try {
			if(CustomerFName.length === 0) throw new Error('missing username')
			if(pass.length === 0) throw new Error('missing password')
			let sql = `SELECT COUNT(CustomerID) as records FROM Customer WHERE CustomerFName="${CustomerFName}";`
			const data = await this.db.get(sql)
			if(data.records !== 0) throw new Error(`username "${CustomerFName}" already in use`)
			pass = await bcrypt.hash(pass, saltRounds)
			sql = `INSERT INTO Customer(CustomerFName, CustomerLName, CustomerDOB, CustomerEmail, pass) VALUES("${CustomerFName}", "${CustomerLName}", "${CustomerDOB}", "${CustomerEmail}", "${pass}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async uploadPicture(path, mimeType) {
		const extension = mime.extension(mimeType)
		console.log(`path: ${path}`)
		console.log(`extension: ${extension}`)
		//await fs.copy(path, `public/avatars/${username}.${fileExtension}`)
	}

	async login(FName, Password) {
		try {
			let sql = `SELECT count(CustomerID) AS count FROM Customer WHERE CustomerFName="${FName}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`CustomerFName "${FName}" not found`)
			sql = `SELECT pass FROM Customer WHERE CustomerFName = "${FName}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(Password, record.pass)
			if(valid === false) throw new Error(`invalid password for account "${FName}"`)
			return true
		} catch(err) {
			throw err
		}
	}

}


/*
 1) Install Courier SDK: npm install @trycourier/courier
 2) Make sure you allow ES module imports: Add "type": "module" to package.json file 
 */
 

 