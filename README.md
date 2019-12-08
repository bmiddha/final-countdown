# Final Countdown

![Docker Pulls](https://img.shields.io/docker/pulls/bmiddha/final-countdown)
![Website](https://img.shields.io/website?label=webapp&url=https%3A%2F%2Ffinal-countdown.azurewebsites.net%2F)
![Website](https://img.shields.io/website?label=beta%20webppp&url=https%3A%2F%2Ffinal-countdown-next.azurewebsites.net%2F)

## CI-CD Status

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/bmiddha/final-countdown/Node%20CI?label=build:%20Node%20CI)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/bmiddha/final-countdown/Docker%20CI?label=build:%20Docker%20CI)

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/bmiddha/final-countdown/Docker%20CD?label=build:%20Docker%20CD%20master)
![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/bmiddha/final-countdown/Docker%20CD/next?label=build:%20Docker%20CD%20next)

## About this project

<img src='https://github.com/bmiddha/final-countdown/raw/master/public/icon-144.png' width='100px' align='right'>
Final Exam Schedule for UIC with countdowns.

This is a progressive web app (PWA) written in TypeScript and React.js.

## Deployments

Public Docker Images: [hub.docker.com/r/bmiddha/final-countdown](https://hub.docker.com/r/bmiddha/final-countdown).

| Branch | Docker Image Tag | Azure App Service Deployment URL                                                         |
| ------ | ---------------- | ---------------------------------------------------------------------------------------- |
| master | latest           | [final-countdown.azurewebsites.net](https://final-countdown.azurewebsites.net)           |
| next   | next             | [final-countdown-next.azurewebsites.net](https://final-countdown-next.azurewebsites.net) |

## Screenshots

![Screenshot](https://github.com/bmiddha/final-countdown/raw/master/screenshots/ss-1.png)

## Docker

The [bmiddha/final-countdown](https://hub.docker.com/r/bmiddha/final-countdown) docker image is _tiny_ and runs a production ready app in NGINX.

```sh
docker pull bmiddha/final-countdown:latest
docker run -it --rm -p 8080:80 bmiddha/final-countdown:latest
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
