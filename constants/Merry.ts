const api_url = "http://192.168.1.4:8000"
export const MerryEndpoints = {
  BASE_URL: api_url,
  PING: `${api_url}/ping/`,
  RECOGNITION: `${api_url}/recognition/`,
  REGISTER: `/auth/signup/`,
  LOGIN: `/auth/signin/`,
  COLLECTION_LIST: `/collection/collections/`,
  COLLECTION_DETAILS: `/collection/collection/`,
};
