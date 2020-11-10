const nodeGeocoder = require('node-geocoder');
const { createClient } = require('@google/maps');
const googleMapsClient = createClient({
  key: 'AIzaSyByuxnGQ5a5pD8VJJBXK23RggGzvD5NwDE',
  timeout: 5000,
  sensor: false,
});
// const options = {
//   provider: 'google',

//   // Optional depending on the providers
//   // fetch: customFetchImplementation,
//   apiKey: 'AIzaSyDJ_uOIYxaN2Y2H_qTk92hgfMBodfWBa8M', // for Mapquest, OpenCage, Google Premier
//   // formatter: null // 'gpx', 'string', ...
// };

// const geoReverse = async ({ lat, lon }) => {
//   const geoCoder = nodeGeocoder(options);

//   return geoCoder.reverse({ lat, lon });
// };

const reverseGeocode = (data) => {
  return new Promise((resolve, reject) => {
    googleMapsClient.reverseGeocode(
      {
        latlng: `${data.lat},${data.lon}`,
      },
      (err, data) => {
        if (err) return reject(err);

        if (data.json.status !== 'OK') return reject(data.json);

        const locationData = data.json.results;

        if (!locationData || !locationData.length)
          return reject({
            status: 'error',
            error: '9998',
            errorText: 'Google Distance Matrix data is empty',
          });

        resolve(locationData[0]);
      }
    );
  });
};

module.exports = {
  //   geoReverse,
  reverseGeocode,
};
