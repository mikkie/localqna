var globalConf = {
    app : {
        appId : 'wx244fbba8964a69b3',
        appSecret : '0f5cbb94a134f9b847e90f3419b509a4'
    },
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
    },
    service : {
       wxApiHost : 'api.weixin.qq.com',
       jscode2sessionApi : '/sns/jscode2session?appid={APPID}&secret={SECRET}&js_code={JSCODE}&grant_type=authorization_code'
    },
    server : {
        session_time_out : 60 * 60
    }
};

module.exports = globalConf;