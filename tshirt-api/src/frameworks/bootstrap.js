const { createApp } = require('./web/webserver');

function startApp() {
  const app = createApp();
  const port = Number(process.env.APP_PORT) || 8080;

  app.listen(port, () => {
    console.log('T-shirt API running on port', port);
  });

  return app;
}

module.exports = startApp;
