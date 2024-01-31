const {Router} = require('express');
const notesRoutes = Router()
const NotesController = require('../controllers/NotesController')


const notesController = new NotesController();
notesRoutes.get('/', notesController.showAll);


notesRoutes.get('/:id', notesController.show);


notesRoutes.post('/:user_id',notesController.create)

// notesRoutes.put('/:user_id',notesController.update)

module.exports = notesRoutes; 