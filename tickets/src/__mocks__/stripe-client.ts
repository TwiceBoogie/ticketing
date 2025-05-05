export const mockStripeProductsCreate = jest.fn().mockResolvedValue({
  id: "prod_test_id",
});
export const mockStripeProductsUpdate = jest.fn().mockResolvedValue({});
export const mockStripePricesCreate = jest.fn().mockResolvedValue({
  id: "price_test_id",
});
export const mockStripePricesUpdate = jest.fn().mockResolvedValue({});
export const stripe = {
  products: {
    create: mockStripeProductsCreate,
    update: mockStripeProductsUpdate,
  },
  prices: {
    create: mockStripePricesCreate,
    update: mockStripePricesUpdate,
  },
};
