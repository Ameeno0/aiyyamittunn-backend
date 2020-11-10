const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const autoIncrement = require('mongoose-auto-increment');

const UserSchema = new Schema(
  {
    pkid: {
      type: Number,
      index: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['admin', 'coordinator', 'user', 'guestUser'],
      default: 'guestUser',
    },
    isEmailVerfied: Boolean,
    adress: String,
    firstName: String,
    lastName: String,
    city: String,
    country: String,
    postalCode: Number,
    aboutMe: String,
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

autoIncrement.initialize(mongoose);

UserSchema.plugin(autoIncrement.plugin, {
  model: 'Users',
  field: 'pkid',
  startAt: 1001,
});

UserSchema.virtual('fridge', {
  ref: 'Fridge',
  localField: 'pkid',
  foreignField: 'coordinatorId',
  justOne: true,
});

UserSchema.virtual('items', {
  ref: 'Items',
  localField: 'pkid',
  foreignField: 'userId',
  justOne: false,
});

UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

const User = mongoose.model('Users', UserSchema);
module.exports = User;
