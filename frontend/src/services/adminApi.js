import axiosClient from "./axiosClient";

// GET /api/admin/charities?page&limit&search
//   -> { success, data: { currentPage, totalItems, charities: [
//        { ...charity fields, owner: { name, email, role } }
//      ] } }
export const fetchAllCharities = async function ({
  search = "",
  page = 1,
  limit = 10,
} = {}) {
  const params = { page, limit };
  if (search) params.search = search;
  const result = await axiosClient.get("/admin/charities", { params });
  return result.data.data;
};

// PATCH /api/admin/charity/:charityId/approve -> { success, message }
// Convenience action for the common "approve a Pending charity" case;
// flips status to Approved and promotes the owner's role to "Charity".
export const approveCharity = async function (charityId) {
  const result = await axiosClient.patch(`/admin/charity/${charityId}/approve`);
  return result.data;
};

// PATCH /api/admin/charity/:charityId/modify-status { targetStatus }
//   targetStatus: "Pending" | "Approved" | "Rejected" | "Suspended"
// The general-purpose status change — used for suspending/reinstating/rejecting.
export const modifyCharityStatus = async function (charityId, targetStatus) {
  const result = await axiosClient.patch(
    `/admin/charity/${charityId}/modify-status`,
    { targetStatus },
  );
  return result.data;
};

// GET /api/admin/users?page&limit&search
//   -> { success, data: { currentPage, totalItems, users: [...] } }
export const fetchAllUsers = async function ({
  search = "",
  page = 1,
  limit = 10,
} = {}) {
  const params = { page, limit };
  if (search) params.search = search;
  const result = await axiosClient.get("/admin/users", { params });
  return result.data.data;
};

// PATCH /api/admin/users/:userId/role { targetRole: "Donor" | "Charity" | "Admin" }
export const changeUserRole = async function (userId, targetRole) {
  const result = await axiosClient.patch(`/admin/users/${userId}/role`, {
    targetRole,
  });
  return result.data;
};
