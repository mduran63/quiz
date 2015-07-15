var models = require('../models/models.js');

// Autoload - Se ejecuta si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
   models.Quiz.find(quizId).then(
      function(quiz) {
         if (quiz) {
            req.quiz = quiz;
            next();
         } else {
            next(new Error('No existe quizId = ' + quizId));
         }
      }
   ).catch(
      function(error) {
         next(error);
      }
   );
};

// GET /quizes
exports.index = function(req, res) {

   // Objeto donde se configura las opciones de FindAll
   // Inicialmente la lista ordenada por Pregunta, siempre.
   var options = {order: 'pregunta'};

   // Cadena a buscar
   var cadena = '';

   // Si nos han pasado un parámetro llamado 'search'
   if(req.query.search) {

      // Preparar cadena de búsqueda y convertir espacios a %
      cadena = '%' + req.query.search + '%'
      cadena = cadena.replace(/ /g,"%");

      // construir Clausula WHERE
      options.where = "pregunta like '" + cadena + "'";
   }
   models.Quiz.findAll(options).then(
      function(quizes) {
         res.render('quizes/index', {quizes: quizes})
      }
   ).catch(
      function(error) {
         next(error);
      }
   );
};

// GET /quizes/:id
exports.show = function(req, res) {
   res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
   var resultado = 'Incorrecto'
   if (req.query.respuesta === req.quiz.respuesta) {
      resultado = 'Correcto';
   }
   res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

// GET /quizes/new
exports.new = function(req, res) {

   // Crear un Objeto quiz para su posterior uso
   var quiz = models.Quiz.build(
      {pregunta: "Pregunta", respuesta: "Respuesta"}
   );
   res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
   var quiz = models.Quiz.build(req.body.quiz);

   // Guardar en BD sólo los campos pregunta y respuesta
   quiz.save({fields: ["pregunta", "respuesta"]}).then(
      function() {
         // Redireccionar a la lista de preguntas
         res.redirect('/quizes');
      }
   );
};
