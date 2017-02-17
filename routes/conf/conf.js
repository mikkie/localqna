var globalConf = {
    logger : {
        dirPath : '/logs',
        logFile : '/logs/lqnaxm.log',
        errFile : '/logs/lqnaxm.err'
    },
    settings : {
        topic : {
            topicClosePeriod : 15 * 60 * 1000
        },
        lbs : {
            maxDistances : 5000
        }
    }
};

module.exports = globalConf;