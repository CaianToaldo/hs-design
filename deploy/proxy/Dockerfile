# hs/deploy: HS Design authenticating proxy (Basic auth + bearer injection).
FROM node:24-alpine
WORKDIR /app
# Built with this directory (deploy/proxy) as the context — set the hs-proxy
# service's Root Directory to deploy/proxy in Railway so the repo-root
# railway.json (which targets the daemon Dockerfile) does not apply here.
COPY proxy.js ./proxy.js
ENV PORT=8080
EXPOSE 8080
USER node
CMD ["node", "proxy.js"]
