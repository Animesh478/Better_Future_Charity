import axiosClient from "./axiosClient";

export const createProject = async function (payload) {
  const result = await axiosClient.post(`/project/registerProject`, payload);
  return result.data.data;
};

// PATCH /api/project/updateProject/:projectId { description?, goalAmount?, status? }
export const updateProject = async function (projectId, payload) {
  const result = await axiosClient.patch(
    `/project/updateProject/${projectId}`,
    payload,
  );
  return result.data.data;
};
