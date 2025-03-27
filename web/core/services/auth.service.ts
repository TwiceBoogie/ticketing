import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { ICsrfTokenData, ICurrentUser } from "@/types/auth";

export class AuthService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async requestCSRFToken(): Promise<ICsrfTokenData> {
    return this.get("/auth/get-csrf-token/")
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  }

  async signOut(baseURL: string): Promise<any> {
    await this.requestCSRFToken().then((data) => {
      const csrfToken = data?.csrf_token;

      if (!csrfToken) throw Error("CSRF token not found");

      const form = document.createElement("form");
      const element1 = document.createElement("input");

      form.method = "POST";
      form.action = `${baseURL}/auth/sign-out/`;

      element1.value = csrfToken;
      element1.name = "csrfmiddlewaretoken";
      element1.type = "hidden";
      form.appendChild(element1);

      document.body.appendChild(form);

      form.submit();
    });
  }

  async getCurrentUser(): Promise<ICurrentUser> {
    return this.get("/api/users/currentuser");
  }
}
