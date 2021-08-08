# TILog-Server

개발자를 위한 블로그 플랫폼 TILog 입니다.

blog platform for developers only, TILog.

# Collaborator

[argon1025](https://github.com/argon1025) Leeseongrok

[MINJE-98](https://github.com/MINJE-98) MINJE

[Daphne-Dev](https://github.com/Daphne-dev) Daphne-dev

# Project Stack

![download-1](https://user-images.githubusercontent.com/55491354/109424917-4a13ee00-7a29-11eb-9d9a-1696ca23c5d9.png)

-   Docker
-   Nginx
-   Mysql
-   NodeJS

# How To Run

## Clone this Project

```
git clone https://github.com/argon1025/TILog-server.git
```

## Using Docker-compose to Run This Server

```
cd ./
docker-compose up --build
```

> Please Change the environment variable(Database password) in docker-compose.yml

# Issues

[Here](https://github.com/argon1025/TILog-server/issues)

## Git flow Branch

-   release : 제품으로 출시될 수 있는 브랜치
-   develop : 다음 출시 버전을 개발하는 브랜치
-   feature : 기능을 개발하는 브랜치
-   main : 이번 출시 버전을 준비하는 브랜치
-   hotfix : 출시 버전에서 발생한 버그를 수정 하는 브랜치
