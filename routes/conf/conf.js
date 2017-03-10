var globalConf = {
    app : {
        appId : 'wx244fbba8964a69b3',
        appSecret : '0f5cbb94a134f9b847e90f3419b509a4',
        mongodb : {
            user : '',
            password : ''
        }
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
        readMe : '1.使用@xxx评论时，本条评论对其他用户不可见。',
        about : '邻答是一个基于场景的迷你话题平台，用户可以随时随地接入自己需要的场景，发起和参与话题讨论，了解身边动态。',
        contact : {
            email : 'true2green@qq.com',
            tel : '13959248595'
        }
    },
    service : {
       wxApiHost : 'api.weixin.qq.com',
       jscode2sessionApi : '/sns/jscode2session?appid={APPID}&secret={SECRET}&js_code={JSCODE}&grant_type=authorization_code'
    },
    server : {
        session_time_out : 60 * 60 * 1000 * 24
    },
    global : {
        anonymousName : '匿名用户',
        anonymousAvatar : '../../images/unknown.png',
        maxDistance : 20
    }
};

module.exports = globalConf;