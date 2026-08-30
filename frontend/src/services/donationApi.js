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

export const fetchMyDonations = async function () {
  const result = await axiosClient.get(`/donations/my-donations`);
  console.log(result);
  return result.data.data;
};

export const downloadReceipt = async function (donationId) {
  const response = await axiosClient.get(`/donations/receipts/${donationId}`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `receipt_${donationId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
