const { userModel } = require('../models');
const bcrypt = require('bcrypt-nodejs');

const restGetAll = async ({ query }) => {
  const { page = 1, count = 10 } = query;

  delete query.page;
  delete query.count;

  if (query.type) query.type = JSON.parse(query.type);

  const skip = (+page ? +page - 1 : +page) * +count;

  const data = await userModel
    .find(query)
    .skip(skip)
    .limit(+count);
  const total = await userModel.count(query);

  return {
    generatedAt: new Date(),
    page,
    count,
    total,
    data,
  };
};

const restGetOne = async ({ params, query }) => {
  return userModel.findOne({ pkid: params.pkid });
};

const createNewUser = async ({ body }) => {
  if (!body.userName || !body.email || !body.password)
    throw new Error('Some fileds are missing');

  const exisitingUser = await userModel.findOne({ email: body.email });

  if (exisitingUser)
    throw new Error(`Email already exists, please try logging in`);

  const user = new userModel();
  user.userName = body.userName;
  user.email = body.email;
  user.mobile = body.mobile || '';
  user.type = body.type;
  user.password = await user.generateHash(body.password);
  return user.save();
};

const updateUser = async ({ params, body }) => {
  const user = await userModel.findOneAndUpdate(
    { pkid: params.pkid },
    { $set: body },
    { new: true }
  );
  return { message: 'User Updated Successfully', data: user };
};

const loginUser = async ({ params, body }) => {
  const user = await userModel.findOne({ email: body.email });

  if (!user) throw new Error('No user found for this email');

  // if (!user.validPassword(body.password))
  //   throw { success: false, message: 'passwords do not match' };

  // return {
  //   success: true,
  //   message: 'Login Successful',
  //   data: user,
  // };
  return new Promise((resolve, reject) => {
    bcrypt.compare(body.password, user.password, (err, result) => {
      if (err) {
        throw err;
      }
      if (result) {
        resolve({
          success: true,
          message: 'Login Successful',
          data: user,
        });
      } else {
        reject({ success: false, message: 'passwords do not match' });
      }
    });
  });
};

const promoteUser = async ({ body }) => {
  // if (body.user.type != 'admin')
  //   throw new Error('Only Admin can promote an user');

  const user = await userModel.findOne({ pkid: body.pkid });

  if (!user) throw new Error(`No user found for pkid ${body.pkid}`);

  user.type = body.type;

  await user.save();

  return 'Updated Successfully';
};

module.exports = {
  rest: {
    restGetAll: ({ params = {}, query = {} }) => {
      return restGetAll({ query });
    },
    restGetOne: ({ params = {}, query = {} }) => {
      return restGetOne({ params, query });
    },
    createNewUser: ({ params = {}, query = {}, body = {} }) => {
      return createNewUser({ body });
    },
    loginUser: ({ params = {}, query = {}, body = {} }) => {
      return loginUser({ body });
    },
    promoteUser: ({ params = {}, query = {}, body = {} }) => {
      return promoteUser({ body });
    },
    updateUser: ({ params = {}, query = {}, body = {} }) => {
      return updateUser({ params, body });
    },
  },
};
