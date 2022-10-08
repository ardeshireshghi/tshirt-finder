function createErrorHandlingMiddleware() {
  return (err, req, res, next) => {
    console.log('App generic error handler', err);
    res.status(500).send({
      message: 'Internal server error, check the logs',
      error: {
        rawMessage: err.message
      }
    });
  };
}

module.exports = createErrorHandlingMiddleware;
