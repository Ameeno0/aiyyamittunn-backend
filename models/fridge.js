const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fridgeSchema = new Schema(
  {
    address: String,
    img: String,
    coordinatorId: Number,
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

fridgeSchema.virtual('coordinator', {
  ref: 'Users',
  localField: 'coordinatorId',
  foreignField: 'pkid',
  justOne: true,
});

fridgeSchema.virtual('items', {
  ref: 'Items',
  localField: '_id',
  foreignField: 'fridgeId',
  justOne: false,
});

fridgeSchema.index({ "location": '2dsphere' });
const Fridge = mongoose.model('Fridge', fridgeSchema);
module.exports = Fridge;
