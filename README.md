# final-countdown

Final Exam Schedule for UIC with countdowns. Deployed on Azure App Service: [https://final-countdown.azurewebsites.net](https://final-countdown.azurewebsites.net).

This is a progressive web app (PWA) written in TypeScript and React.js.

## Screenshots

![Screenshot](https://github.com/bmiddha/final-countdown/raw/master/screenshots/ss-1.png)

## Docker

The [bmiddha/final-countdown](https://hub.docker.com/r/bmiddha/final-countdown) docker image is _tiny_ and runs a production ready app in NGINX.

```sh
docker pull bmiddha/final-countdown
docker run -it --rm -p 8080:80 bmiddha/final-countdown
```

## Building

```sh
npm install
npm run build
```

## Developing

```sh
npm install
npm run start
```
