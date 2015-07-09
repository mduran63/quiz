var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null,
   {dialect: 'sqlite', storage: 'quiz.sqlite'});

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Exportar definición de la tabla Quiz
exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa la tabla de preguntas en la BBDD
sequelize.sync().success(function() {
   // success(..) ejecuta el manejador de creación de la tabla
   Quiz.count().success(function (count) {
      // La tabla se inicializa sólo si está vacía
      if(count === 0) {
         Quiz.create({pregunta: 'Capital de Italia',
                      respuesta: 'Roma'}
                   ).success(function() {
                      console.log('Base de datos inicializada')
                   });
      };
   });
});
