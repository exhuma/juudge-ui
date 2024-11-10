FROM node:20 AS base
ADD . /usr/local/src/juudge
WORKDIR /usr/local/src/juudge
RUN npm clean-install

FROM base AS build-prod
ARG VITE_BUILD_REF
ARG VITE_BUILD_DATE
ARG NODE_OPTIONS
COPY --from=base \
  /usr/local/src/juudge \
  /usr/local/src/juudge
WORKDIR /usr/local/src/juudge
RUN npm run build

FROM nginx:alpine as image-prod
COPY docker-resources/nginx-http.conf /etc/nginx/conf.d/default.conf
COPY docker-resources/entrypoint.sh /
COPY --from=build-prod \
     /usr/local/src/juudge/package-lock.json \
     /package-lock.json
COPY --from=build-prod \
     /usr/local/src/juudge/dist/ \
     /opt/juudge
ARG JUUDGE_API_URL=http://localhost:3000

EXPOSE 80
EXPOSE 443
ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
