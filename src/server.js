require('express-async-errors')
const express = require('express');
const AppError = require('./utils/AppError');
const routes = require('./routes');
const migrationsRun = require('./database/sqlite/migrations')

const app = express()
app.use(express.json())


app.use(routes);

migrationsRun() 

app.use((error, request, response, next) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            menssage: error.menssge
        });
    }

    console.error(error);
        return response.status(500).json({
        status: 'error',
        menssage: 'Internal Server Error'
    })
})

const PORT = 3333;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})