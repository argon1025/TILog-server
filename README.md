
<div align="center">
    <img src="https://user-images.githubusercontent.com/55491354/146318970-b962dcc7-ed78-41e2-9d4e-d453fa4af043.png" alt="Logo">

  <h3 align="center">TILog server</h3>

  <p align="center">
    blog platform for developers, TILog.<br />
    Frontend project is at another<a href="https://github.com/argon1025/Tilog-client"> Repo</a> <br />
    개발자를 위한 블로그 플랫폼 TILog 입니다.
    <br />
    <br />
    <a href="https://github.com/argon1025/TILog-server">View Demo</a>
    ·
    <a href="https://github.com/argon1025/TILog-server/issues">Report Bug</a>
    ·
    <a href="https://github.com/argon1025/TILog-server/issues">Request Feature</a>
  </p>
</div>

# Project Status
Last Release Build : [![CircleCI](https://circleci.com/gh/argon1025/TILog-server/tree/release.svg?style=svg)](https://circleci.com/gh/argon1025/TILog-server/tree/release)

# Team
![image](https://user-images.githubusercontent.com/55491354/146319436-555170dd-5e59-4484-a049-6e80dc8f2713.png)
- 프로젝트 셋팅 및 [Dockerize](https://github.com/argon1025/TILog-server/blob/main/docker-compose.yml)
- [데이터 베이스 설계](https://github.com/argon1025/TILog-server/blob/main/docker/mysql/mysql-init-files/init.sql)
- [에러처리](https://github.com/argon1025/TILog-server/tree/main/src/src/ExceptionFilters)
- [포스트 서비스](https://github.com/argon1025/TILog-server/tree/main/src/src/posts)
- [Image to S3 업로드](https://github.com/argon1025/TILog-server/blob/main/src/src/file-uploads/file-uploads.service.ts)

![image](https://user-images.githubusercontent.com/55491354/146319449-2636ea9e-4166-454d-8d71-60f8d90b9895.png)
- [Comments 서비스](https://github.com/argon1025/TILog-server/tree/main/src/src/comments)
- [Users 서비스](https://github.com/argon1025/TILog-server/tree/main/src/src/users)
- [Passport를 사용한 인증](https://github.com/argon1025/TILog-server/tree/main/src/src/auth)
- [UserBlogCustomization 서비스](https://github.com/argon1025/TILog-server/tree/main/src/src/user-blog-customization)


![image](https://user-images.githubusercontent.com/55491354/146319456-6dd8503d-9167-484f-ae1c-56ce4feee377.png)
- 작성필요



# Built With
- NestJS
- TypeScript
- MySQL
- typeORM
- Redis


### ERD Diagram
<img src="https://user-images.githubusercontent.com/55491354/129714087-95a8cb3d-cb80-4a5e-92dc-ac60219d84c3.png" alt="erd" width="300">

# Getting Started

## 1. Clone this Project
```
git clone https://github.com/argon1025/TILog-server.git
```

## 2. Move Project folder and Install npm module
```
cd TILog-server
npm install
```

## 3. Create environment file
```
// vi .env
// vi .end.dev

# Server Settings
SERVER_PORT=3000
SERVER_HOST=localhost

# CORS Settings
CORS_METHOD=GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
CORS_ORIGIN=true
CORS_CREDENTIALS=true

# Database Settings
DB_PASSWORD=
DB_DATABASE=TILog
DB_USERNAME=TILog
DB_HOST=
DB_PORT=3306

# Redis storage Settings
REDIS_HOST=redis://localhost
REDIS_PORT=6379

# Passport Settings
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=

# Session Settings
SESSION_SECRET=
SESSION_RESAVE=
SESSION_SAVEUNINITIALIZED=
## 24H
SESSION_COOKIE_MAXAGE=86400000

# Front Server Setting
REDIRECT_FRONT=http://localhost:8080/login

# S3 fileUpload settings
AWS_S3_BUCKET=
AWS_S3_ACCESS_KEY=
AWS_S3_KEY_SECRET=
MAXIMUM_IMAGE_FILE_SIZE_BYTES=10000000

# Post cursor Settings
POSTS_GET_CONTENT_LIMIT=30

# Throttle Settings
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

## 4.Using Docker-compose to Run This Server
```
docker-compose up --build
```
> Please Change the environment variable(Database password) in docker-compose.yml
