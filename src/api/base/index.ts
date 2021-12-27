import axios from 'axios';
import { generateQueryString, QueryParams } from './query-params';

export interface PagedResponse<T> {
  results: T[];
  page: number;
  count: number;
}

interface Options {
  params?: QueryParams;
  headers?: { [key: string]: string };
}

const apiUrl = process.env.REACT_APP_API_URL

const axiosInstance = axios.create({
  baseURL: apiUrl,
  paramsSerializer: generateQueryString
});

axiosInstance.interceptors.response.use(
  undefined,
  (error) => {
    const { response: { data } } = error;
    return Promise.reject(data);
  },
);

export function get(endpoint: string, options: Options = {}) {
  const { headers, params } = options;

  return axiosInstance.get(endpoint, {
    params,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

export function post(endpoint: string, data: any, options: Options = {}) {
  const { headers } = options;

  return axiosInstance.post(endpoint, data, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

export function put(endpoint: string, data: any, options: Options = {}) {
  const { headers } = options;

  return axiosInstance.put(endpoint, data, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

export function patch(endpoint: string, data: any, options: Options = {}) {
  const { headers } = options;

  return axiosInstance.patch(endpoint, data, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

export function del(endpoint: string, options: Options = {}) {
  const { headers } = options;

  return axiosInstance.delete(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}
