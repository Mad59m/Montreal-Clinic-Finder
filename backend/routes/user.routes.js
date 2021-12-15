const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post(
    "/api/user/favorite",
    [authJwt.verifyToken],
    controller.addToFavorite
  );
  app.get("/api/user/favorite", [authJwt.verifyToken], controller.getFavorites);
};
