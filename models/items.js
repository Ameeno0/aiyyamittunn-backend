const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  type: {
    type: String,
    enum: ['FOOD', 'CLOTHES'],
    required: true,
  },
  noi: Number, //number of items or parcels
  description: String,
  fridgeId: { type: String, required: true },
  userId: Number,
  isDeleted: Boolean,
  isActive: Boolean,
});

itemSchema.virtual('coordinator', {
  ref: 'Users',
  localField: 'coordinatorId',
  foreignField: 'pkid',
  justOne: true,
});

itemSchema.virtual('fridge', {
  ref: 'Fridge',
  localField: 'fridgeId',
  foreignField: '_id',
  justOne: true,
});

const Items = mongoose.model('Items', itemSchema);
module.exports = Items;
