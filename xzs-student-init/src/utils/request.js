import axios from 'axios'
import vue from 'vue'
import Cookies from 'js-cookie'

let myToken;
let cookieT=Cookies.get('token')
if(cookieT){
  myToken=cookieT;
}
//else{
 // myToken='eyJhbGciOiJIUzUxMiIsImlhdCI6MTYyMTc3Njg0MSwiZXhwIjoxNjI0MzY4ODQxfQ.eyJ1aWQiOjQsIm5pY2tuYW1lIjoic3R1ZGVudDIwMjEiLCJzY29wZSI6IlN0dWRlbnRTY29wZSIsImVtYWlsIjoieHNjeHNjQDE2My5jb20iLCJyb2xlIjoic3R1ZGVudCJ9.wrXPoDds-nabDcsSxxqbXimoXhkKhiliBkkzPrMSVc9xM4F-q0M6Ng4B6svOw9Pq5H4GP7QWCMWBWevNSrlMlw';
//}
else{
 myToken='eyJhbGciOiJIUzUxMiIsImlhdCI6MTYyMjE5MDY4MSwiZXhwIjoxNjI0NzgyNjgxfQ.eyJ1aWQiOjEwLCJuaWNrbmFtZSI6InN0dWRlbnQyMDIyIiwic2NvcGUiOiJTdHVkZW50U2NvcGUiLCJlbWFpbCI6IjE2OTI3ODQ0NDU1NzIxMkBxcS5jb20iLCJyb2xlIjoic3R1ZGVudCJ9.oeiOYXuqkrXKO0iW1mZX6CiKCpIQphyoCBwjl0tw2ueNmDeWV1_TqMGwjWQl1p0vP9yTf9yfX8VXdPqxEzAUlg'
}
//const myToken='eyJhbGciOiJIUzUxMiIsImlhdCI6MTYyMTc3NDUwNywiZXhwIjoxNjI0MzY2NTA3fQ.eyJ1aWQiOjEsIm5pY2tuYW1lIjoidGVzdDIwMjEiLCJzY29wZSI6IkFkbWluaXN0cmF0b3JTY29wZSIsImVtYWlsIjoieHNjMUBxcS5jb20iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciJ9.uh7zeBSEdhqXPAwFy34w8vmmS5P5MRCF05biY6qTWeLioSsp9ioCq4SXCIAQFJ_lj8sCHORVHY0efvspvLmkCA'
// http request 拦截器
axios.interceptors.request.use(
  config => {
      if (myToken) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
          config.headers.Authorization = `Bearer ${myToken}`;
      }
      return config;
  },
  err => {
      return Promise.reject(err);
  });
// http response 拦截器
axios.interceptors.response.use(
  response => {
      return response;
  },
  error => {
      if (error.response) {
          switch (error.response.status) {
              case 402:
                  // 返回 401 清除token信息并跳转到登录页面
                  store.commit(types.LOGOUT);
                  router.replace({
                      path: 'login',
                      query: {redirect: router.currentRoute.fullPath}
                  })
          }
      }
      return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });
const request = function (loadtip, query) {
  let loading
  if (loadtip) {
    loading = vue.prototype.$loading({
      lock: false,
      text: '正在加载中…',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.5)'
    })
  }
  return axios.request(query)
    .then(res => {
      if (loadtip) {
        loading.close()
      }
      if (res.data.code === 401) {
        vue.prototype.$$router.push({ path: '/login' })
        return Promise.reject(res.data)
      } else if (res.data.code === 500) {
        return Promise.reject(res.data)
      } else if (res.data.code === 501) {
        return Promise.reject(res.data)
      } else if (res.data.code === 502) {
        vue.prototype.$$router.push({ path: '/login' })
        return Promise.reject(res.data)
      } else {
        return Promise.resolve(res.data)
      }
    })
    .catch(e => {
      if (loadtip) {
        loading.close()
      }
      vue.prototype.$message.error(e.message)
      return Promise.reject(e.message)
    })
}

const post = function (url, params) {
  const query = {
    url: url,
    method: 'post',
    withCredentials: true,
    timeout: 30000,
    data: params,
    headers: { 'Content-Type': 'application/json', 'request-ajax': true }
  }
  return request(false, query)
}

const postWithLoadTip = function (url, params) {
  const query = {
    url: url,
    method: 'post',
    withCredentials: true,
    timeout: 30000,
    data: params,
    headers: { 'Content-Type': 'application/json', 'request-ajax': true }
  }
  return request(true, query)
}

const postWithOutLoadTip = function (url, params) {
  const query = {
    url: url,
    method: 'post',
    withCredentials: true,
    timeout: 30000,
    data: params,
    headers: { 'Content-Type': 'application/json', 'request-ajax': true }
  }
  return request(false, query)
}

const get = function (url, params) {
  const query = {
    url: url,
    method: 'get',
    withCredentials: true,
    timeout: 30000,
    params: params,
    headers: { 'request-ajax': true }
  }
  return request(false, query)
}

const form = function (url, params) {
  const query = {
    url: url,
    method: 'post',
    withCredentials: true,
    timeout: 30000,
    data: params,
    headers: { 'Content-Type': 'multipart/form-data', 'request-ajax': true }
  }
  return request(false, query)
}

export {
  post,
  postWithLoadTip,
  postWithOutLoadTip,
  get,
  form
}
