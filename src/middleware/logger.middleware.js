const morgan = require('morgan');

// Development log format
const requestLogger = morgan('dev');

module.exports = requestLogger;
