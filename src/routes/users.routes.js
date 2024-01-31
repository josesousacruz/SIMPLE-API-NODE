const {Router} = require('express');
const usersRoutes = Router()
const UsersController = require('../controllers/UsersController')


const usersController = new UsersController();

usersRoutes.get('/', usersController.getAll);


usersRoutes.post('/login',usersController.create)

usersRoutes.put('/login/:id',usersController.update)

module.exports = usersRoutes; 