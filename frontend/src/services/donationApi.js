import axiosClient from "./axiosClient";

export const createDonationCheckout = async function ({ projectId, amount }) {
  // the server returns an object that has the payment session id
  const result = await axiosClient.post("/donations/checkout", {
    projectId,
    amount,
  });
  //   console.log(result.data.data);
  return result.data.data;
};

export const verifyDonationStatus = async function (donationId) {
  const result = await axiosClient.get("/donations/check-status", {
    params: {
      donationId,
    },
  });
  //   console.log(result);
  return result.data.data;
};
