const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const init = require('aws-sdk/clients/s3')
const s3 = new init({apiVersion: '2006-03-01'})
 
app.use(awsServerlessExpressMiddleware.eventContext())

const signedUrl = signUrl(process.env.BUCKET, process.env.FILE);
console.log("Signed URL: ",signedUrl)
const options = {
    swaggerOptions: {
        url: signedUrl
    }
}

app.use('/', swaggerUi.serve, swaggerUi.setup(null, options));

module.exports = app

function signUrl(bucket, file) {
    return s3.getSignedUrl('getObject', {
        Bucket: bucket,
        Key: file,
        Expires: parseInt(process.env.EXPIRE_SECONDS) || 3600
    })
}

