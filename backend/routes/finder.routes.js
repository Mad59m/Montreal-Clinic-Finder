const { authJwt } = require("../middlewares");
const controller = require("../controllers/finder.controller");

module.exports = function (app) {
  app.post(
    "/api/finder/clinic",
    // [authJwt.verifyToken],
    controller.clinic
  );
};
