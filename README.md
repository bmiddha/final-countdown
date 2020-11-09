<p align='center'>
    <img src='public/logo-with-name.png' width='450px' alt='Final Countdown' />
</p>

<p align='center'>
    <a href='https://final-countdown.azurewebsites.net'>
        <img src='https://img.shields.io/website?label=release&url=https%3A%2F%2Ffinal-countdown.azurewebsites.net%2F' alt='Release' />
    </a>
    <a href='https://final-countdown-next.azurewebsites.net'>
        <img src='https://img.shields.io/website?label=public%20beta&url=https%3A%2F%2Ffinal-countdown-next.azurewebsites.net%2F' alt='Public Beta' />
    </a>
    <a href='https://github.com/bmiddha/final-countdown/actions?query=workflow%3A%22Node+CI%22'>
        <img src='https://img.shields.io/github/workflow/status/bmiddha/final-countdown/Node%20CI?label=build:%20Node%20CI' alt='build status' />
    </a>
    <a href='https://github.com/bmiddha/final-countdown/actions?query=workflow%3A%22Docker+CI%22'>
        <img src='https://img.shields.io/github/workflow/status/bmiddha/final-countdown/Docker%20CI?label=build:%20Docker%20CI' alt='build status' />
    </a>
    <a href='https://github.com/bmiddha/final-countdown/actions?query=workflow%3A%22Docker+CD+-+main%22'>
        <img src='https://img.shields.io/github/workflow/status/bmiddha/final-countdown/Docker%20CD?label=build:%20Docker%20CD%20-%20main' alt='build status' />
    </a>
    <a href='https://github.com/bmiddha/final-countdown/actions?query=workflow%3A%22Docker+CD+-+next%22'>
        <img src='https://img.shields.io/github/workflow/status/bmiddha/final-countdown/Docker%20CD/next?label=build:%20Docker%20CD%20-%20next' alt='build status' />
    </a>
    <a href='https://github.com/bmiddha/final-countdown/blob/main/LICENSE'>
        <img src='https://img.shields.io/github/license/bmiddha/final-countdown' alt='license' />
    </a>
</p>

## About this project

Final Exam Schedule for UIC with countdowns.

This is a progressive web app (PWA) written in [TypeScript](https://www.typescriptlang.org/) and [React.js](https://reactjs.org/).

## Deployments

Public Docker Images: [hub.docker.com/r/bmiddha/final-countdown](https://hub.docker.com/r/bmiddha/final-countdown).

| Branch                                                       | Docker Image Tag | Azure App Service Deployment URL                                                         | Build Status                                                                                                                                                                                          | App Status                                                                                                                                                               |
| ------------------------------------------------------------ | ---------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [main](https://github.com/bmiddha/final-countdown)         | latest           | [final-countdown.azurewebsites.net](https://final-countdown.azurewebsites.net)           | [![build status](https://img.shields.io/github/workflow/status/bmiddha/final-countdown/Docker%20CD)](https://github.com/bmiddha/final-countdown/actions?query=workflow%3A%22Docker+CD+-+main%22)    | [![app status](https://img.shields.io/website?label=webapp&url=https%3A%2F%2Ffinal-countdown.azurewebsites.net%2F)](https://final-countdown.azurewebsites.net)           |
| [next](https://github.com/bmiddha/final-countdown/tree/next) | next             | [final-countdown-next.azurewebsites.net](https://final-countdown-next.azurewebsites.net) | [![build status](https://img.shields.io/github/workflow/status/bmiddha/final-countdown/Docker%20CD/next)](https://github.com/bmiddha/final-countdown/actions?query=workflow%3A%22Docker+CD+-+next%22) | [![app status](https://img.shields.io/website?label=webapp&url=https%3A%2F%2Ffinal-countdown-next.azurewebsites.net%2F)](https://final-countdown-next.azurewebsites.net) |

## Screenshots

![Screenshot](https://github.com/bmiddha/final-countdown/raw/main/screenshots/ss-1.png)

## Getting Started

- Dependencies: `npm install`
- Building: `npm run build`
- Developing: `npm run start`

## Docker Deployment

The [bmiddha/final-countdown](https://hub.docker.com/r/bmiddha/final-countdown) docker image is _tiny_ and runs a production ready app in NGINX.

```sh
docker pull bmiddha/final-countdown:latest
docker run -it --rm -p 8080:80 bmiddha/final-countdown:latest
```

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch: `git checkout -b feature/AmazingFeature`
3. Commit your Changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the Branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request
