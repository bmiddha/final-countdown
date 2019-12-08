FROM node:12-alpine as build

LABEL maintainer="5100938+bmiddha@users.noreply.github.com"

WORKDIR /app
COPY package.json /app/package.json
RUN npm install --silent
COPY . .
RUN npm run build

FROM nginx:alpine as publish

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
