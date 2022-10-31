import api from "./api.services";

const createSecret = (customerId, data) =>
  api().post(`/v1/pay/${customerId}/secret`, data);

const partialRefund = (customerId, paymentIntentId, amount) =>
  api().post(
    `/v1/pay/partialRefund/${customerId}?paymentIntentId=${paymentIntentId}`,
    {
      amount,
    }
  );

const fullRefund = (customerId, paymentIntentId) =>
  api().post(
    `/v1/pay/fullRefund/${customerId}?paymentIntentId=${paymentIntentId}`
  );

const updatePaymentStatus = (customerId, paymentIntentId, paymentStatus) =>
  api().patch(
    `/v1/pay/updateStatus/${customerId}?paymentIntentId=${paymentIntentId}`,
    { paymentStatus }
  );

export { createSecret, partialRefund, fullRefund, updatePaymentStatus };
