import axiosClient from "./axiosClient";

export const generateImpactReport = async function (projectId, payload) {
  const result = await axiosClient.post(
    `/reports/generate-report/${projectId}`,
    payload,
  );
  console.log(result);
  return result.data.data;
};

export const fetchProjectReports = async function (
  projectId,
  { page = 1, limit = 10 } = {},
) {
  const result = await axiosClient.get(
    `/public/projects/${projectId}/reports`,
    {
      params: {
        page,
        limit,
      },
    },
  );
  console.log(result);
  return result.data.data;
};
