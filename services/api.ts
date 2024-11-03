import axios from "axios";
import { MerryEndpoints } from "@constants/Merry";

const api = axios.create({
  baseURL: MerryEndpoints.BASE_URL,
});

export const registerUser = async (
  name: string,
  username: string,
  password: string
) => {
  return api.post(MerryEndpoints.REGISTER, { name, username, password });
};

export const loginUser = async (username: string, password: string) => {
  return api.post(MerryEndpoints.LOGIN, { username, password });
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const ping = async () => {
  console.log(MerryEndpoints.PING)
  return api.get(MerryEndpoints.PING);
};

export const getCollections = async () => {
  return api.get(MerryEndpoints.COLLECTION_LIST);
};

export const getCollectionDetails = async (collectionId: number | null) => {
  const url = collectionId
    ? `${MerryEndpoints.COLLECTION_DETAILS}${collectionId}/`
    : MerryEndpoints.COLLECTION_DETAILS;
  return api.get(url);
};

export const postCardRecognition = async (photo: File) => {
  const formData = new FormData();
  formData.append("image", photo);
  return api.post(MerryEndpoints.CARD_RECOGNITION, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const postCardCollection = async (illustration_slug: string) => {
  return api.post(MerryEndpoints.MANAGE_ILUSTRATION, { illustration_slug });
};


export const deleteCardCollection = async (illustration_slug: string) => {
  return api.delete(MerryEndpoints.MANAGE_ILUSTRATION, { data: { illustration_slug } });
};



export default api;
