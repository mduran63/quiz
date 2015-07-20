// Get /login     --> Formulario de Login
exports.new = function(req, res) {
   var errors = req.session.errors || {};
   req.session.errors = {};

   res.render('sessions/new', {errors: errors});
};

// Post /Login    --> Crear la Sesión
exports.create = function(req, res) {
   var login = req.body.login;
   var password = req.body.password;

   var userController = require('./user_controller');
   userController.autenticar(login, password, function(error, user) {

      // Si hay error, retornar mensaje de error de sesión
      if (error) {
         req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
         res.redirect("/login");
         return;
      }

      // Crear req.session.user y guardar campos id y username
      // La sesión se define por la existencia de: req.session.user
      req.session.user = {id:user.id, username:user.username};

      // Redirección a path anterior al Login
      res.redirect(req.session.redir.toString());
   });
};

// DELETE /logout    --> Destruir sesión
exports.destroy = function(req, res) {
   delete req.session.user;

   // Redirección a path anterior al Login
   res.redirect(req.session.redir.toString())
};
