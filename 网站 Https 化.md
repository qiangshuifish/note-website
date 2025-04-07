# 网站 Https 化



首先需要安转依赖软件

```shell
sudo yum install epel-release snapd -y

```

安装成功后执行如下命令来创建引用和设置开机自启

```shell
sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap
```

然后安装 certbot

```shell
sudo snap install --classic certbot

sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

如果有报错,需要等一会再执行

```shell
error: too early for operation, device not yet seeded or device model not acknowledged
```

最后托管 nginx，程序会自动根据你的nginx配置来生成证书，并自动修改，按照提示操作即可

```
# nginx 托管
sudo certbot --nginx


# 设置定时任务自动更新
sudo certbot renew --dry-run
```



自动修改的配置

```nginx
# Settings for a TLS enabled server.
#
    server {
        listen       443 ssl http2 default_server;
        listen       [::]:443 ssl http2 default_server;
        server_name   blog.res360.cn;
        root         /usr/share/nginx/html;
    ssl_certificate /etc/letsencrypt/live/res360.cn/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/res360.cn/privkey.pem; # managed by Certbot
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout  10m;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
            proxy_set_header X-Real-IP $remote_addr;
		    proxy_pass  http://blog;
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }

}
```



其他更多参见：

https://certbot.eff.org/instructions?ws=nginx&os=centosrhel7

https://snapcraft.io/docs/installing-snap-on-centos