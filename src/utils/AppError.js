class AppError {
    menssge;
    statusCode;

    constructor(menssge,statusCode=400){
        this.menssge = menssge;
        this.statusCode = statusCode
    }
}

module.exports = AppError