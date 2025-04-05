export class CsrfError extends Error {
  constructor(message = "Invalid CSRF Token") {
    super(message);
    this.name = "CsrfError";
  }
}
