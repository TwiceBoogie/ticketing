import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useState } from "react";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

interface UseRequestProps<T> {
  url: string;
  method: HttpMethod;
  body?: T;
  onSuccess?: (data: any) => void;
}

interface ErrorResponse {
  message: string;
  data?: any;
}

interface UseRequestReturn<T> {
  doRequest: (props?: T) => Promise<any>;
  errors: JSX.Element | null;
}

interface TypedAxiosInstance extends AxiosInstance {
  [key: string]: any;
}

const useRequest = <T extends {}>({
  url,
  method,
  body,
  onSuccess,
}: UseRequestProps<T | ErrorResponse>): UseRequestReturn<T> => {
  const [errors, setErrors] = useState<JSX.Element | null>(null);

  const axiosInstance: TypedAxiosInstance = axios.create(); // create a strongly typed instance of the axios object

  const doRequest = async (props: T = {} as T): Promise<any> => {
    try {
      setErrors(null);
      const response = await axiosInstance[method](url, { ...body, ...props }); // use the axiosInstance object instead of axios
      console.log("this should be my res", response);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      const errorResponse = (err as { response: ErrorResponse }).response;

      if (errorResponse && errorResponse.data && errorResponse.data.errors) {
        setErrors(
          <div className="alert alert-danger">
            <h4>Ooops....</h4>
            <ul className="my-0">
              {errorResponse.data.errors.map((err: ErrorResponse) => (
                <li key={err.message}>{err.message}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        setErrors(
          <div className="alert alert-danger">
            <h4>Ooops....</h4>
            <ul className="my-0">
              <li>Something went wrong.</li>
            </ul>
          </div>
        );
      }
    }
  };

  return { doRequest, errors };
};

export default useRequest;
