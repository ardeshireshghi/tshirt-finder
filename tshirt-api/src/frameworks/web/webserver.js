const cors = require('cors');
const express = require('express');

const { tshirtSearchAdapter } = require('../services');
const createGetTshirtsUseCase = require('../../application/use-cases/getTshirts');
const createErrorHandlingMiddleware = require('./middlewares/error-handling');

const getTshirtsUseCase = createGetTshirtsUseCase({ tshirtSearchAdapter });

function createApp() {
  const app = express();

  app.use(cors());

  app.get('/healthcheck', (_, res) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
    };
    res.send(healthcheck);
  });

  app.get('/api/v1/tshirts', async (req, res, next) => {
    try {
      const tshirts = await getTshirtsUseCase();
      return res.status(200).json({
        data: tshirts
      });
    } catch (err) {
      next(err);
    }
  });

  app.use(createErrorHandlingMiddleware());
  return app;
}

exports.createApp = createApp;
