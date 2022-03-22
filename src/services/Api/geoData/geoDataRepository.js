import ApiClient from "../ApiClient";

const resource = "/v1/geoData";
export default {
  findCity(name) {
    return ApiClient.get(`${resource}/findCity?namePart=${name}`);
  },
  findStreet(streetName) {
    return ApiClient.get(`${resource}/findStreet?namePart=${streetName}`);
  },
  findStreetInCity(streetName, cityName) {
    return ApiClient.get(
      `${resource}/findStreet?namePart=${streetName}&city=${cityName}`
    );
  },
  getGeoData(cityName, streetName, houseNumber) {
    return ApiClient.get(
      `${resource}/getGeoData?city=${cityName}&street=${streetName}&house=${houseNumber}`
    );
  },
};
