# nginx


## 根据nginx 实现灰度系统

软件开发一般不会上来就是最终版本，而是会一个版本一个版本的迭代。

新版本上线前都会经过测试，但就算这样，也不能保证上线了不出问题。

所以，在公司里上线新版本代码一般都是通过灰度系统。


比如我们有两个 地址 `172.19.16.147:3000` 和 `172.19.16.147:3001`

我们给这两个地址创建两个模块`version1.0_server` 和 `version2.0_server`

对应我们 1.0版本访问的地址 和 2.0版本访问的地址

然后需要根据某个条件来区分转发给哪个服务。

我们这里根据 cookie 来区分：

``` nginx
set $group "default";
if ($http_cookie ~* "version=1.0"){
    set $group version1.0_server;
}

if ($http_cookie ~* "version=2.0"){
    set $group version2.0_server;
}

location ^~ /api {
    rewrite ^/api/(.*)$ /$1 break;
    proxy_pass http://$group;
}
```

如果 `cookie 中 version=1.0` 则请求的地址是 1.0地址 
如果 `cookie 中 version=2.0` 则请求的地址是 2.0地址 

``` nginx
# 转发服务
upstream version1.0_server {
    server 172.19.16.147:3000;
}
 
upstream version2.0_server {
   server 172.19.16.147:3001;
}

upstream default {
    server 172.19.16.147:3000;
}

server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    #access_log  /var/log/nginx/host.access.log  main;


    set $group "default";

    if ($http_cookie ~* "version=1.0"){
        set $group version1.0_server;
    }

    if ($http_cookie ~* "version=2.0"){
        set $group version2.0_server;
    }


    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    location ^~ /api {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://$group;
    }


    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}


```


什么时候设置的这个 cookie 呢？

比如我想实现 80% 的流量走版本 1.0，20% 的流量走版本 2.0

其实公司内部一般都有灰度配置系统，可以配置不同的版本的比例，然后流量经过这个系统之后，就会返回 Set-Cookie 的 header，里面按照比例来分别设置不同的 cookie。

比如随机数载 0 到 0.2 之间，就设置 version=2.0 的 cookie，否则，设置 version=1.0 的 cookie。

这也叫做流量染色。

第一次请求的时候，会按照设定的比例随机对流量染色，也就是设置不同 cookie。

再次访问的时候会根据 cookie 来走到不同版本的代码。

其中，后端代码会根据 cookie 标识来请求不同的服务（或者同一个服务走不同的 if else），前端代码可以根据 cookie 判断走哪段逻辑。

这就实现了灰度功能，可以用来做 5% 10% 50% 100% 这样逐步上线的灰度上线机制。

也可以用来做产品的 AB 实验。

公司里都会用这样的灰度系统。