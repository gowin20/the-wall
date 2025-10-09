'use strict'
import awsServerlessExpress from 'aws-serverless-express';
import app from './src/server';
import {MongoClient} from 'mongodb';

import dotenv from 'dotenv'
dotenv.config();

// Connect to MongoDB
const connectionString = process.env.ATLAS_URI || ""
export const client = new MongoClient(connectionString);

// Package API as lambda handler
const server = awsServerlessExpress.createServer(app)
export const handler = (event, context) => awsServerlessExpress.proxy(server, event, context)