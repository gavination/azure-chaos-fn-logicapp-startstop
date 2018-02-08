const chaosFnUtility = require('azure-chaos-fn');
const logicManagement = require('azure-arm-logic');

function startLogicApp(credential, subscriptionId, resourceGroupName, resourceName, logger) {
    const client = new logicManagement(credential, subscriptionId);
    logger(`Starting logic app ${resourceName} in resource group ${resourceGroupName}`);
    return client.workflows.start(
        resourceGroupName,
        resourceName
    );
}

module.exports = function (context, req) {
    context.log('Beginning stop of chaos event');

    context.log('Starting Logic App');
    const credential = chaosFnUtility.parsers.accessTokenToCredentials(req);
    const resources = chaosFnUtility.parsers.resourcesToObjects(req);
    Promise.all(resources.map(resource => startLogicApp(
            credential,
            resource.subscriptionId,
            resource.resourceGroupName,
            resource.resourceName,
            context.log
    )))
        .then(() => {
            context.log('Completed starting Logic App');
            context.done();
        })
        .catch(err => {
            context.log('Error starting Logic App');
            context.log(err);
            context.done();
        });
};
