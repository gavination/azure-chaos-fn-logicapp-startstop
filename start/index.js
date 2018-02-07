const testFunc = require('../utility').testFunc;

function validateParams(req, logger) {
    if (!req.query.accessToken && !(req.body && req.body.accessToken)) {
        logger('accessToken not passed');
        return false;
    }

    if (!req.query.resources && !(req.body && req.body.resources)) {
        logger('resources not passed');
        return false;
    }

    return true;
}

module.exports = function (context, req) {
    testFunc(context.log);
    context.log('Beginning start of chaos event');

    if (!validateParams(req, context.log)) {
        context.res = {
            status: 400,
            body: "Required params are accessToken and resources"
        };
        context.done();
    }
    else {
        context.log('Parameter validation passed');
        context.done();
    }
};
