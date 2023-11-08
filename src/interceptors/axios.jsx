import axios from "axios";
const API_KEY = import.meta.env.VITE_API_KEY;

// change between the live site and the test server
axios.defaults.baseURL = "http://localhost:3001";
//axios.defaults.baseURL = "https://smartinventory-backend.glitch.me";

// API call for login
export const loginUser = async (username, password) => {
  const url = "/api/login";

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      api_key: API_KEY,
    },
    data: {
      username: username,
      password: password,
    },
    url: url,
  };

  const result = await axios(options)
    .then((res) => {
      if (res.status === 200) {
        return res.data.token;
      }
    })
    .catch((err) => {
      alert("Wrong Login Info!");
    });

  return result;
};

// API call to register User
export const registerUser = async (username, password) => {
  const url = "/api/register";

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      api_key: API_KEY,
    },
    data: {
      username: username,
      password: password,
    },
    url: url,
  };

  let res = false;
  res = await axios(options)
    .then((response) => {
      if (response.status === 200) {
        return true;
      }
    })
    .catch((err) => {
      alert("Username Taken!");
    });

  return res;
};

// API call to get files from server
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

export const uploadFile = async (
  auth,
  stegName,
  file,
  mName,
  mSkip,
  mPeriod,
  mSize
) => {
  const url = "/api/upload";

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: auth(),
    },
    data: {
      stegName: stegName,
      file: file,
      mName: mName,
      mSkip: mSkip,
      mPeriod: mPeriod,
      mSize: mSize,
    },
    url: url,
  };

  return await axios(options)
    .then((response) => {
      if (response.status === 200) {
        return true;
      }
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
};
// API call to delete file from server
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
