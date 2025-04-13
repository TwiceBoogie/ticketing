export const stripe = {
  charges: {
    create: jest.fn().mockImplementation(({ amount }) =>
      Promise.resolve({
        id: "ch_test_id",
        amount,
        currency: "usd",
      })
    ),
  },
};
