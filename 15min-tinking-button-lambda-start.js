const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions();
const stateMachineArn = process.env['STATE_MACHINE_ARN']

exports.handler = (event, context, callback) => {

    event.timer_seconds = 10

    var params = {
        stateMachineArn: stateMachineArn, /* required */
        input: JSON.stringify(event,null,2),
        // name: 'STRING_VALUE'
    }
    console.log(params)

    stepfunctions.startExecution(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            callback(null, {"result":"ng", "reason":"Failed to stepfunctions" + err})
        }
        else{
            console.log(data);           // successful response
            callback(null, {"result":"ok"})
        }
    })
}
