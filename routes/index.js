var express = require('express');
var router = express.Router();

// Carga de controladores
var quizController = require('../controllers/quiz_controller');

// Página de entrada o Home Page
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId
// Indica que si en la ruta existe un parámetro con nombre quizId, se ejecuta la función
router.param('quizId', quizController.load);

// Rutas /quizes
router.get('/quizes',                        quizController.index);
router.get('/quizes/:quizId(\\d+)',          quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',   quizController.answer);
router.get('/quizes/new',                    quizController.new);
router.post('/quizes/create',                quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',     quizController.edit);
router.put('/quizes/:quizId(\\d+)',          quizController.update);
router.delete('/quizes/:quizId(\\d+)',       quizController.destroy);

// Página de Créditos
router.get('/quizes/author', function(req, res) {
  res.render('author', {errors: []});
});

module.exports = router;
