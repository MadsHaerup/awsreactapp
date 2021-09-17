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



