# stk-app

# deploy to server
node .\src\deployer.js

# nginx##
systemctl enable nginx # 设置开机启动
service nginx start # 启动 nginx 服务
service nginx stop # 停止 nginx 服务
service nginx restart # 重启 nginx 服务
service nginx reload # 重新加载配置，一般是在修改过 nginx 配置文件时使用。

/etc/nginx/nginx.conf
/var/log/nginx/error.log

# andorid
ionic integrations enable capacitor

ionic build
ionic cap add android
ionic cap open android

npx cap copy
