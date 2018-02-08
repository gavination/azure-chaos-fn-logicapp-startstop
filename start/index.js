const chaosFnUtility = require('azure-chaos-fn');
const logicManagement = require('azure-arm-logic');

function stopLogicApp(credential, subscriptionId, resourceGroupName, resourceName, logger){
    const client = new logicManagement(credential, subscriptionId);
    logger(`Stopping logic app ${resourceName} in resource gorup ${resourceGroupName}`);
    return client.workflows.disable(
        resourceGroupName,
        resourceName
    );
}

module.exports = function (context, req) {
    context.log('Beginning start of chaos event');

    context.log('Stopping logic app');
    const credential = chaosFnUtility.parsers.accessTokenToCredentials(req);
    const resources = chaosFnUtility.parsers.resourcesToObjects(req);
    Promise.all(resources.map(resource => stopLogicApp(
            credential,
            resource.subscriptionId,
            resource.resourceGroupName,
            resource.resourceName,
            context.log
    )))
        .then(() => {
            context.log('Completed disabling logic app');
            context.done();
        })
        .catch(err => {
            context.log('Error disableing logic app');
            context.log(err);
            context.done();
        });
};
