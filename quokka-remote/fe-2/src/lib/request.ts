import axios from "axios";
import { getCookie } from "cookies-next";

export const request = axios.create({
  baseURL: process.env['NEXT_PUBLIC_BASE_URL'],
  headers: {
    // 'Content-Type': 'application/json',
    // 'Cache-Control': 'no-cache',
    // 'Pragma': 'no-cache',
    // 'Expires': '0',
  }
});

request.interceptors.request.use(function (config) {
  config.headers['Authorization'] = getCookie(process.env['NEXT_PUBLIC_JWT_SECRET_TOKEN_NAME'] as any)
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});