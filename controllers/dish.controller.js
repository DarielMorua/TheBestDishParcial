const DisheModel = require("../models/dishes.model").DishModel;

async function list(req, res) {
  let dishList = await DisheModel.find({});
  return res.json(dishList);
}

async function getDish(req, res) {
  let dishId = req.query.dishId;

  let dishObj = await DisheModel.find({ _id: dishId });
  return res.json(dishObj);
}

async function createDish(req, res) {
  let dishName = req.body.dishName;
  let dishDescription = req.body.dishDescription;
  let dishPrice = req.body.dishPrice;
  let dishImgSrc = req.body.dishImgSrc;
  let dishType = req.body.dishType;

  let dishObj = new DisheModel({
    dishName: dishName,
    dishDescription: dishDescription,
    price: dishPrice,
    dishImgSrc: dishImgSrc,
    type: dishType,
  });

  return res.json(dishObj);
}

module.exports = {
  getDish,
  createDish,
  list,
};
