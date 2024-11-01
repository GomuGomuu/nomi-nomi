import { MERRY_API_URL } from "@env";

export const MerryEndpoints = {
  BASE_URL: MERRY_API_URL,
  PING: `${MERRY_API_URL}/ping/`,
  RECOGNITION: `${MERRY_API_URL}/recognition/`,
  REGISTER: `/auth/signup/`,
  LOGIN: `/auth/signin/`,
  COLLECTION_LIST: `/collection/collections/`,
  COLLECTION_DETAILS: `/collection/collection/`,
};
