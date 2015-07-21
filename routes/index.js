var express = require('express');
var router = express.Router();

// Carga de controladores
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

// Página de entrada o Home Page
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId
// Indica que si en la ruta existe un parámetro con nombre quizId, se ejecuta la función
router.param('quizId', quizController.load);

// Rutas de Sesión
router.get('/login',    sessionController.new);       // Formulario de Login
router.post('/login',   sessionController.create);    // Crear sesión
router.get('/logout',   sessionController.destroy);   // Destruir sesión

// Rutas /quizes
router.get('/quizes',                        quizController.index);
router.get('/quizes/:quizId(\\d+)',          quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',   quizController.answer);
router.get('/quizes/new',                    sessionController.loginRequired, quizController.new);
router.post('/quizes/create',                sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',     sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',          sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',       sessionController.loginRequired, quizController.destroy);

// Rutas de Comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',   commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',      commentController.create);

// Página de Créditos
router.get('/quizes/author', function(req, res) {
  res.render('author', {errors: []});
});

module.exports = router;
