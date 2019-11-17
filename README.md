# :baggage_claim: Swagger UI Serverless with Basic Authentication [ AWS ]

Use this project to deploy SwaggerUI on a lambda with basic authentication. 
The swagger file and the credentials can be placed in an S3 bucket for easy access and does not require modifications to the code.


### :construction: Prerequisites:
    - S3 bucket: To store the json file and the credentials file.
    - Serverless: To deploy the project to AWS
    - AWS Account: Configure an AWS account locally using AWS cli

### :factory: Architecture:

Swagger UI is deployed on a lambda function using packages like [AWS-Serverless-Express](https://github.com/awslabs/aws-serverless-express) which provides calls from lambda to an Express app. It also makes use of the [Swagger-UI-Express](https://github.com/scottie1984/swagger-ui-express) package which helps run swagger in express.

We use a authorizer to validate the basic authentication credentials. This lambda function is invoked by AWS API Gateway. The gateway response is modified to give back the WWW-Authenticate header.
