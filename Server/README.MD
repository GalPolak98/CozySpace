Environment Variables Configuration
This project uses environment variables to manage configuration settings. These variables are stored in a .env file in the project root.
Setup

Copy the .env.example file to a new file named .env:

cp .env.example .env

Open the .env file and update the values according to your environment.

Available Variables

PORT: The port number on which the server will run (default: 3000)
MONGO_PASSWORD: The connection string for your MongoDB database

Example:
PORT=3000
MONGO_PASSWORD = password

Running the Server
To run the server, follow these steps:

Ensure all dependencies are installed:
npm install

This command uses ts-node-dev to run the server, which will automatically restart when file changes are detected.
For production, first build the TypeScript files and then run the compiled JavaScript:

npm run build
npm start
