const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./orders.controller");
const dishesRouter = require("../dishes/dishes.router");
// TODO: Implement the /orders routes needed to make the tests pass

router.use("/:orderId/dishes", controller.orderExists, dishesRouter);
router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);
router.route("/:orderId").get(controller.read).put(controller.update).delete(controller.delete).all(methodNotAllowed);

module.exports = router;
