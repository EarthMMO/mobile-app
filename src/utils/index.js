//import fakeAuth from "fake-auth";
import { BACKEND_API_URL } from "config/config";

export function apiRequest(path, method = "GET", data) {
  //const accessToken = fakeAuth.getAccessToken();

  return fetch(`${BACKEND_API_URL}/api/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${"accessToken"}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status === "error") {
        // Automatically signout user if accessToken is no longer valid
        if (response.code === "auth/invalid-user-token") {
          fakeAuth.signout();
        }

        throw new CustomError(response.code, response.message);
      } else {
        return response;
      }
    });
}

// Create an Error with custom message and code
export function CustomError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
