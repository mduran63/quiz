var models = require('../models/models.js');

// Autoload - Se ejecuta si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
   models.Quiz.find(
      { where: { id: Number(quizId) },
        include: [{ model: models.Comment}]
      }
   ).then(
      function(quiz) {
         if (quiz) {
            req.quiz = quiz;
            next();
         } else {
            next(new Error('No existe quizId = ' + quizId))
         };
      }
   ).catch(function(error) {next(error)});
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
         res.render('quizes/index', {quizes: quizes, errors: []})
      }
   ).catch(
      function(error) {
         next(error);
      }
   );
};

// GET /quizes/:id
exports.show = function(req, res) {
   res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
   var resultado = 'Incorrecto';
   if (req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()) {
      resultado = 'Correcto';
   };
   res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {

   // Crear un Objeto quiz para su posterior uso
   var quiz = models.Quiz.build(
      {pregunta: "Pregunta", respuesta: "Respuesta", categoria: ""}
   );
   res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
   var quiz = models.Quiz.build( req.body.quiz );

   /* Para que funciona el 'then' después del 'validate', hay que desinstalar
      la versión de sequelize que indican en el curso e instalar la versión 2,
      de la forma siguiente:
         npm uninstall sequelize
         npm install -save sequelize@2.0.0
   */
   quiz.validate().then(
      function(err) {
         if (err) {
            res.render('quizes/new', {quiz: quiz, errors: err.errors});
         } else { // Guardar en BD sólo los campos pregunta y respuesta
            quiz.save({fields: ["pregunta", "respuesta", "categoria"]}).then(
               function() {res.redirect('/quizes')}
            );
         }
      }
   );
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {

   // El MW Autoload ya precarga el objeto quiz de req.
   var quiz = req.quiz;

   res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
   req.quiz.pregunta = req.body.quiz.pregunta;
   req.quiz.respuesta = req.body.quiz.respuesta;
   req.quiz.categoria = req.body.quiz.categoria;

   req.quiz.validate().then(
      function(err) {
         if (err) {
            res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
         } else { // Guardar en BD sólo los campos pregunta y respuesta
            req.quiz.save({fields: ["pregunta", "respuesta", "categoria"]}).then(
               function() {res.redirect('/quizes')}
            );
         }
      }
   );
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
   req.quiz.destroy().then(
      function() {
         res.redirect('/quizes');
      }
   ).catch(function(error) {next(error)});
};
