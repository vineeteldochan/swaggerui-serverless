const init = require('aws-sdk/clients/s3')
const s3 = new init({apiVersion: '2006-03-01'})

exports.handler = (event, context, callback) => {
    var authorizationHeader = event.headers.Authorization
  
    if (!authorizationHeader) return callback('Unauthorized')
  
    const encodedCreds = authorizationHeader.split(' ')[1]
    const plainCreds = (Buffer.from(encodedCreds, 'base64')).toString().split(':')
    const username = plainCreds[0]
    const password = plainCreds[1]
    
    const params = {
        Bucket: process.env.BUCKET,
        Key: process.env.FILE
    };
    s3.getObject(params, (err,data)=>{
        let credentials = '';
        try {
            credentials = JSON.parse(data.Body.toString('utf-8'));
        } catch (e){
            console.log("PARSE ERROR");
        }

        if(credentials instanceof Array && credentials.length > 0){
            let match = false;
            credentials.forEach((credential) => {
                if (username === credential.username && password === credential.password){
                    match = true;
                }
            });

            if(match === false){
                return callback('Unauthorized')
            }
        }
        
        var authResponse = buildAllowAllPolicy(event, username)
    
        return callback(null, authResponse);
    });
  }
  
  function buildAllowAllPolicy (event, principalId) {
    var apiOptions = {}
    var tmp = event.methodArn.split(':')
    var apiGatewayArnTmp = tmp[5].split('/')
    var awsAccountId = tmp[4]
    var awsRegion = tmp[3]
    var restApiId = apiGatewayArnTmp[0]
    var stage = apiGatewayArnTmp[1]
    var apiArn = 'arn:aws:execute-api:' + awsRegion + ':' + awsAccountId + ':' +
      restApiId + '/' + stage + '*'
    const policy = {
      principalId: principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: [apiArn]
          }
        ]
      }
    }
    return policy
  }