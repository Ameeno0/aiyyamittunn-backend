const { itemsModel } = require('../models');

const getAllItems = async ({ query }) => {
  const { page = 1, count = 10 } = query;

  delete query.page;
  delete query.count;

  const skip = (+page ? +page - 1 : +page) * +count;

  const data = await itemsModel
    .find(query)
    .skip(skip)
    .limit(+count);

  const total = await itemsModel.count(query);

  return {
    generatedAt: new Date(),
    page,
    count,
    total,
    data,
  };
};

const getOneItem = async ({ params }) => {
  return {
    data: await itemsModel.findOne({ _id: params.id }),
  };
};

const addNewItem = async ({ body }) => {
  const item = new itemsModel();
  item.type = body.type;
  item.description = body.description;
  item.noi = body.noi;
  item.fridgeId = body.fridgeId;
  item.userId = body.userId;
  await item.save();
  return {
    message: 'Item added Successfully',
  };
};

const updateItem = async ({ body }) => {
  const itemId = body._id;
  const userType = body.userType;
  delete body._id;
  delete body.userType;
  body.isActive = userType != 'user';

  await itemsModel.updateOne({ _id: itemId }, { $set: body });

  return {
    message: 'Updated SuccessFully',
  };
};

module.exports = {
  rest: {
    getAllItems: ({ params = {}, query = {} }) => {
      return getAllItems({ query });
    },
    getOneItem: ({ params = {}, query = {} }) => {
      return getOneItem({ params });
    },
    addNewItem: ({ params = {}, body = {} }) => {
      return addNewItem({ body });
    },
    updateItem: ({ params = {}, body = {} }) => {
      return updateItem({ body });
    },
  },
};
