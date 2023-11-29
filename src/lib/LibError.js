class LibError extends Error {
    constructor(message = "Too Many Requests!") {
      super(message);
    }
  }

export default LibError;
