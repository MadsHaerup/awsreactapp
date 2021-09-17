 # Getting started with Aws and Amplify

 Install amplify globally: `npm install -g @aws-amplify/cli`

 Configure amplify: 
 type amplify configure in the terminal and follow the steps and set up an Aws account.
* create a user with the provided link from the terminal
* save the accesKeyId and SecretAccesKey for later use

 Create the frontend: npx create-react-app .

 Initialize amplify: amplify init and fill in the Project information shown
  Name: your project name
| Environment: dev
| Default editor: Visual Studio Code
| App type: javascript
| Javascript framework: react
| Source Directory Path: src
| Distribution Directory Path: build
| Build Command: npm.cmd run-script build
| Start Command: npm.cmd run-script start

? Initialize the project with the above configuration? Yes
Using default provider  awscloudformation
? Select the authentication method you want to use: AWS profile

type in: amplify console and choose console


On the onsole dashboard in your project under Front-end environments choose to deploy through github


amplify add auth and choose default
 Do you want to use the default authentication and security configuration? 
> Default configuration 
  Default configuration with Social Provider (Federation)
  Manual configuration
  I want to learn more.

  amplify status - tells what the diffrent is between your local code and whats on the cloud

  amplify push - will push the alternazation to the cloud

 yarn add aws-amplify @aws-amplify/ui-react

adding GraphQl api to the backend
* amplify add api
* choose GraphQl
* Amazon Cognito user pool
* choose schema

# Error solutions

Error: 
* ReferenceError: primordials is not defined
    add following to package.json
      "resolutions": {
          "graceful-fs": "^4.2.4"
        }