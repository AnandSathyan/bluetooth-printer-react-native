// import axios from 'axios';
// import env from '../../config/env';
// const api = axios.create({
//   baseURL: `${env.NEXT_PUBLIC_API_URL}/SelfCheckOutAPI`,
//   timeout: 10000,
// });
// console.log("process.env",env.NEXT_PUBLIC_API_URL)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://74.208.235.72:1001/SelfCheckOutAPI',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  },
});

export default api;
