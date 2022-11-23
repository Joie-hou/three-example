import axios from "axios";

//请求实例
const server = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  timeout: 15000,
});

// 添加请求拦截器
server.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    Promise.reject(error);
  }
);

// 添加响应拦截器
server.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default server;
