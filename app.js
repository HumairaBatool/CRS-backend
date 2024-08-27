const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes=require('./routes/authRoutes')
const app = express();
app.use(cors()); // This allows all origins(hosts).
app.use(bodyParser.json());
app.use('/api',authRoutes)

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/awagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


module.exports = app; 
