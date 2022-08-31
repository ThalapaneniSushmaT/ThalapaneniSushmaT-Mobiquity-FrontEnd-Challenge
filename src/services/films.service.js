import axios from "axios";
import URI from "./uri";

/**
 * Api call to fetch the list of star wars films
 * @returns promise of the api
 */
const getFilmsList = () => {
  const url = `${process.env.REACT_APP_API_URL}${URI.GET_ALL_FILMS}`;
  return axios.get(url);
};

export { getFilmsList };
