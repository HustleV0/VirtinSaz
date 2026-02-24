FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/cloudflare-realip.conf /etc/nginx/conf.d/cloudflare-realip.conf
COPY conf.d/cloudflare-allow.conf /etc/nginx/conf.d/cloudflare-allow.conf
