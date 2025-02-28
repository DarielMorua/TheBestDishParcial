const OrderModel = require("../models/order.model").OrderModel;

async function createNewOrder(req, res) {
  let clientName = req.body.clientName;

  let newOrder = new OrderModel({
    clientName: clientName,
  });

  return res.json(newOrder);
}

async function addDish(req, res) {
  let orderId = req.body.orderId;
  let dishId = req.body.dishId;

  await OrderModel.updateOne(
    { _id: orderId },
    {
      $push: {
        dishes: dishId,
      },
    }
  );

  return res.json(updatedOder);
}

async function removeDish(req, res) {
  let orderId = req.body.orderId;
  let dishId = req.body.dishId;

  await OrderModel.updateOne(
    { _id: orderId },
    {
      $pull: {
        dishes: dishId,
      },
    }
  );

  let updatedOder = await OrderModel.findOne({ _id: orderId });

  return res.json(updatedOder);
}

async function getOrder(req, res) {
  let orderId = req.query.orderId;

  let orderObj = await OrderModel.findOne({ _id: orderId });

  return res.json(orderObj);
}

module.exports = {
  createNewOrder,
  addDish,
  removeDish,
  getOrder,
};
