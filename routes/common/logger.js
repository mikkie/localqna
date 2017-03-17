var conf = require('../conf/conf');
var winston = require('winston');
var moment = require('moment');
require('winston-daily-rotate-file');
var fs = require('fs');
var shell = require('shelljs');

winston.emitErrs = true;

(function(dirPath){
    if (!fs.existsSync(dirPath)) {
        if(!dirPath){
            console.log('dirPath is null');
            return;
        }
        shell.mkdir('-p', dirPath);
    }
})(conf.logger.dirPath);


function dateFormat(){
	return moment().format('YYYY-MM-DD HH:mm:ss.S');
};


var logger = new (winston.Logger)({
	  transports: [
		new (winston.transports.Console)({
			level: "info",
		    handleExceptions: true,
		    json: false,
		    colorize: true
		  }),
	    new (winston.transports.DailyRotateFile)({
              level: "info",
              name : 'logFile',
	          filename: conf.logger.logFile,
	          handleExceptions: true,
	          humanReadableUnhandledException:true,
	          json: false,
	          timestamp: dateFormat,
	          colorize: false,
              datePattern : 'yyyy-MM-dd',
              localTime: true,
              prepend : true
	    }),
	    new (winston.transports.DailyRotateFile)({
              level: "error",
              name : 'errFile',
	          filename: conf.logger.errFile,
	          handleExceptions: true,
	          humanReadableUnhandledException:true,
	          json: false,
	          timestamp: dateFormat,
	          colorize: false,
              datePattern : 'yyyy-MM-dd',
              localTime: true,
              prepend : true
	    })
	  ],
	  
	  exitOnError: false
	});

module.exports = logger;

module.exports.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};


