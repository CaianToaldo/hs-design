# hs/deploy: HS Design authenticating proxy (Basic auth + bearer injection).
FROM node:24-alpine
WORKDIR /app
COPY proxy.js ./proxy.js
ENV PORT=8080
EXPOSE 8080
USER node
CMD ["node", "proxy.js"]
