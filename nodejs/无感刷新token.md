# 基于refresh_token 和 access_token 做无感刷新

我们登录基于JWT做，jwt 是有有效期的，我们设置的是 7 天，实际上为了安全考虑会设置的很短，比如 30 分钟。

这时候用户可能还在访问系统的某个页面，结果访问某个接口返回 token 失效了，让重新登录。

为了解决这个问题，服务端一般会返回两个 token：access_token 和 refresh_token

access_token 就是用来认证用户身份的，而 refresh_token 是用来刷新 token 的，服务端会返回新的 access_token 和 refresh_token

access_token 设置 30 分钟过期，而 refresh_token 设置 7 天过期。这样 7 天内，如果 access_token 过期了，那就可以用 refresh_token 刷新下，拿到新 token。



## axios

使用axios 拦截器，请求的时候自动带上 accesstoken·

``` js
axios.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem('access_token');

  if(accessToken) {
    config.headers.authorization = 'Bearer ' + accessToken;
  }
  return config;
})
```

请求失败的时候 自动去调用刷新接口



``` js
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let { data, config } = error.response;

    if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
        
      const res = await refreshToken();

      if(res.status === 200) {
        return axios(config);
      } else {
        alert('登录过期，请重新登录');
        return Promise.reject(res.data)
      }
        
    } else {
      return error.response;
    }
  }
)
```
可以从config 中获取到请求失效的接口信息 自动重发


但是这种方法有个问题就是 同事有多个请求的时候 会刷新多次。

``` ts
interface PendingTask {
  config: AxiosRequestConfig
  resolve: Function
}
let refreshing = false;
const queue: PendingTask[] = [];

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let { data, config } = error.response;

    if(refreshing) {
      return new Promise((resolve) => {
          queue.push({
              config,
              resolve
          });
      });
    }

    if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
        refreshing = true;

        const res = await refreshToken();

        refreshing = false;

        if(res.status === 200) {

          queue.forEach(({config, resolve}) => {
              resolve(axios(config))
          })
  
          return axios(config);
        } else {
          alert('登录过期，请重新登录');
          return Promise.reject(res.data);
        }
        
    } else {
      return error.response;
    }
  }
)
```


我们用栈保存一下请求信息，当请求成功的时候 一并调用。