const Schema = mongoose.Schema;

const orderSchema = new Schema({
  date: { type: Date },
  clientName: {
    type: String,
    required: true,
  },
  dishes: {
    type: [mongoose.Schema.ObjectId],
    ref: "Dish",
    required: true,
    default: [],
  },
  hasPromotion: {
    type: Boolean,
    default: false,
  },
  total: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = {
  OrderModel,
};
