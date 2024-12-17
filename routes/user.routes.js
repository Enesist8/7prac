const Router = require('express');
const router = new Router();
const userController = require('../controller/user.controller'); // Assuming this file is named user.controller.js

router.post('/users', userController.createUser);
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getOneUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.post('/api/login', userController.login);


module.exports = router;