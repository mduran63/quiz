var express = require('express');
var router = express.Router();

// Carga de controladores
var quizController = require('../controllers/quiz_controller');

// Página de entrada o Home Page
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Rutas /quizes
router.get('/quizes',                        quizController.index);
router.get('/quizes/:quizId(\\d+)',          quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',   quizController.answer);

// Página de Créditos
router.get('/quizes/author', function(req, res) {
  res.render('author');
});

module.exports = router;
