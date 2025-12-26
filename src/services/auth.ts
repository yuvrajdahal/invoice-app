import api from "@/lib/axios";

export function register(username: string, password: string) {
  return new Promise<{
    message:string;
    user:any
  }>((resolve, reject) => {
    api
      .post<{
    message:string;
    user:any
      }>("register", {
        username: username,
        password: password,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function login(username: string, password: string) {
  return new Promise<{
    accessToken: string;
    refreshToken: string;
    message: string;
  }>((resolve, reject) => {
    api
      .post<{
        accessToken: string;
        refreshToken: string;
        message: string;
      }>("login", {
        username: username,
        password: password,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
