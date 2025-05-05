export const mockStripeCheckoutSessionCreate = jest.fn().mockResolvedValue({
  id: "test_session_id",
  url: "https://fake-checkout-url.stripe.com",
});

export const mockStripeCheckoutSessionExpire = jest.fn().mockResolvedValue({});

export const stripe = {
  checkout: {
    sessions: {
      create: mockStripeCheckoutSessionCreate,
      expire: mockStripeCheckoutSessionExpire,
    },
  },
};
