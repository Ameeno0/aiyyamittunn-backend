const { fridgeModel } = require('../models');
// const { reverseGeocode } = require('./geoCoder');
const geocoding = new require('reverse-geocoding-google');

const restGetAll = async ({ query }) => {
  const { page = 1, count = 10 } = query;

  delete query.page;
  delete query.count;

  const skip = (+page ? +page - 1 : +page) * +count;

  const data = await fridgeModel
    .find(query)
    .skip(skip)
    .limit(+count)
    .populate('coordinator');
  const total = await fridgeModel.count(query);

  return {
    generatedAt: new Date(),
    page,
    count,
    total,
    data,
  };
};

const restGetBasedOnLocation = async ({ query }) => {
  // if (typeof query.coordinates != 'object')
  //   query.coordinates = JSON.parse(query.coordinates);

  // var config = {
  //   latitude: +query.lat,
  //   longitude: +query.lon,
  //   key: 'AIzaSyByuxnGQ5a5pD8VJJBXK23RggGzvD5NwDE',
  // };

  const coordinates = [+query.lon, +query.lat];
  // console.log(query);
    // const address = await reverseGeocode({
    //   lat: query.lat,
    //   lon: query.lon,
    // });

    // await geocoding.location(config, function (err, data) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(data);
    //   }
    // });


  const fridgeData = await fridgeModel.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates },
        distanceField: 'distance',
        maxDistance: +query.maxDistance || 100000,
        spherical: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'coordinatorId',
        foreignField: 'pkid',
        as: 'coordinator',
      },
    },
    { $limit: 10 },
  ]);

  return {
    data: fridgeData,
  };
};

const createFridge = async ({ body }) => {
  // if (body.user.type != 'admin')
  //   throw new Error('Only Admin can create a new fridge');

  const fridge = new fridgeModel();
  fridge.location.coordinates = body.coordinates;
  fridge.address = body.address;
  if (body.coordinatorId) fridge.coordinatorId = body.coordinatorId;

  await fridge.save();

  return 'New Fridge Data created Successfully';
};

module.exports = {
  rest: {
    restGetAll: ({ params = {}, query = {} }) => {
      return restGetAll({ query });
    },
    restGetBasedOnLocation: ({ params = {}, query = {} }) => {
      return restGetBasedOnLocation({ query });
    },
    createFridge: ({ params = {}, body = {} }) => {
      return createFridge({ body });
    },
  },
};
