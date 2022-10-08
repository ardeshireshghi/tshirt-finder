const serverless = require('serverless-http');
const { createApp } = require('./src/frameworks/web/webserver');

module.exports.handler = serverless(createApp());
