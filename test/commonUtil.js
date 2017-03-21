var mocha = require('mocha'),
    chai = require('chai'),
    commonUtil = require('../routes/util/commonUtil');
    chai.should();



describe('commonUtil',function(){
    describe('#dates',function(){
        it('formatTime',function(){
            commonUtil.dates.formatTime(new Date('2017-03-21 : 15:31')).should.equal('03/21 15:31');
        });
    });
});