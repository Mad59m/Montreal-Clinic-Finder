const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});
const gapiConfig = require("../config/gapi.config");

exports.clinic = (req, res) => {
  postalCode = req.body.postalCode;
  if (!postalCode) {
    res.status(400).send({ message: "Missing postal code" });
    return;
  }
  client
    .geocode({
      params: {
        address: postalCode,
        key: gapiConfig.API_KEY,
        // region: "BE",
      },
      timeout: 5000,
    })
    .then((resp) => {
      address = resp.data.results[0].geometry.location;
      client
        .placesNearby({
          params: {
            location: address,
            type: "hospital",
            radius: 100,
            key: gapiConfig.API_KEY,
          },
          timeout: 5000,
        })
        .then((nearbyRes) => {
          console.log(nearbyRes);
          return res.status(200).send(nearbyRes.data.results);
        });
    })
    .catch((e) => {
      console.log("error detail", e.response);
      //   return res.status(500).send({ message: e.response.data.error_message });
    });
  //   res.status(200);
};
