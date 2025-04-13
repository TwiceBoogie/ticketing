const mockChargeCreate = jest.fn().mockResolvedValue({
  id: "test_charge_id",
  status: "succeeded",
});

const mockStripe = jest.fn().mockImplementation(() => {
  return {
    charges: {
      create: mockChargeCreate,
    },
  };
});

export default mockStripe;
