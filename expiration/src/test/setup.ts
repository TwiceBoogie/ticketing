jest.mock("../nats-wrapper");
// tried doing it manually but wouldn't work regardless
// if it was inside __mocks__ or __mocks__/queues/<here>
jest.mock("../queues/expiration-queue", () => ({
  expirationQueue: {
    add: jest.fn(),
  },
}));
// no cross-test interference, accurate expect(mockFn).toHaveBeenCalled() asserts
beforeEach(() => {
  jest.clearAllMocks();
});
