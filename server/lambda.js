'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const app = require('./server')
const {MongoClient} = require('mongodb')
require('dotenv').config()

// Connect to MongoDB
const connectionString = process.env.ATLAS_URI || ""
exports.client = new MongoClient(connectionString);

// Package API as lambda handler
const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)