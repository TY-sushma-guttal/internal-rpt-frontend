import { axiosInstance } from "../../App";

const get = (url, args) => {
  return axiosInstance.get(url, args);
};

const getWithResp = (url, reqObj) => {
  return axiosInstance.get(url, reqObj);
};

const post = (url, reqObj, args) => {
  return axiosInstance.post(url, reqObj, args);
};

const put = (url, reqObj, args) => {
  return axiosInstance.put(url, reqObj, args);
};

const remove = (url, id) => {
  return axiosInstance.delete(`${url}/${id}`);
};

const deleteById = (url) => {
  return axiosInstance.delete(`${url}`);
};

const deleteAll = (url, reqObj) => {
  return axiosInstance.delete(url, { data: reqObj });
};

const serviceUtil = {
  get,
  post,
  put,
  remove,
  deleteById,
  deleteAll,
  getWithResp,
};

export default serviceUtil;
