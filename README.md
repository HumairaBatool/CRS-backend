## Table of Contents
- [Frontend](#frontend)
- [Backend](#backend)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [Development Server](#development-server)
- [Built With](#built-with)
- [Contributing](#contributing)

## Frontend

This project was generated with Angular CLI version 14.2.13.

## Backend

This project uses Node.js, Express, Sequelize, and MySQL for the backend.

### Installation
1. Clone the repository: `git clone https://github.com/HumairaBatool/CRS-backend.git`.
2. Run `npm install` to install dependencies.
3. Run `npm install cors` to enable CORS support.

### Create the MySQL Database
1. On Terminal Run `mysql -u root -p`
2. Create Your Database `CREATE DATABASE <Your_Database_Name>;`
3. Create a `.env` file for environment like .env.example and required credentials here.

### Database Setup
1. Run `npx sequelize-cli db:migrate` to set up the database schema.
2. Run `npx sequelize-cli db:seed:all` to seed initial data.

### Running the Project
Start the backend server with `node server.js`.

## Built With
- Node.js
- Express.js
- Sequelize
- MySQL
