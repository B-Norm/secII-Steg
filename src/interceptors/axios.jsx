import axios from "axios";
const API_KEY = import.meta.env.VITE_API_KEY;

// change between the live site and the test server
axios.defaults.baseURL = "http://localhost:3001";
//axios.defaults.baseURL = "https://smartinventory-backend.glitch.me";

export const getFiles = async () => {
  const url = "/api/getFiles";

  const options = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      api_key: API_KEY,
    },
    url: url,
  };

  const res = await axios(options)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  return res;
};

export const deleteFile = async (fileId, auth) => {
  const url = "/api/deleteFile";

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: auth(),
    },
    data: {
      _id: fileId,
    },
    url: url,
  };

  const res = await axios(options)
    .then((response) => {
      if (response.status === 200) return true;
      else return false;
    })
    .catch((err) => {
      console.log(err);
    });

  return res;
};
