FROM node:14-alpine as build

LABEL maintainer="5100938+bmiddha@users.noreply.github.com"

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:alpine as publish

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
