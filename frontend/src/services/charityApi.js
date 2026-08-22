import axiosClient from "./axiosClient";

// the empty object means that if the user is not passing anything, it will be an empty object and use the default values
export const fetchCharities = async function ({
  search = "",
  page = 1,
  limit = 10,
} = {}) {
  try {
    const params = { page, limit };
    if (search) params.search = search;
    const result = await axiosClient.get("/public/charities", { params });
    return result.data.data; // {charities: [], totalItems:2, totalPages:1}
  } catch (error) {
    console.error(error);
  }
};
