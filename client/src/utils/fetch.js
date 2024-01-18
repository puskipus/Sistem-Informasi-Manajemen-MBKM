import axios from "axios";
import handleError from "./handleError";
import { config } from "../configs";

export async function getData(url, params) {
  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : {};

  try {
    return await axios.get(`${config.api_host_dev}${url}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    return handleError(err);
  }
}

export async function postData(url, payload, formData, onUploadProgress) {
  try {
    const token = localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : {};

    return await axios.post(`${config.api_host_dev}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
      onUploadProgress,
    });
  } catch (err) {
    return handleError(err);
  }
}

export async function putData(url, payload, formData) {
  try {
    const token = localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : {};

    return await axios.put(`${config.api_host_dev}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
  } catch (err) {
    return handleError(err);
  }
}

export async function deleteData(url) {
  try {
    const token = localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : {};

    return await axios.delete(`${config.api_host_dev}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    return handleError(err);
  }
}
