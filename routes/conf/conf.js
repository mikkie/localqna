var globalConf = {
    app : {
        appId : '',
        appSecret : '',
        mongodb : {
            user : '',
            password : ''
        },
        ali:{
            id : '',
            key : '',
            bucket : '',
            endPoint : '',
            dir : '',
            callbackUrl : '',
            expire : 30 * 60 * 1000
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
        readMe : '1.点击用户头像@xxx评论时，本条评论对其他用户不可见。',
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