# 베이스 이미지를 지정합니다
# 2021.02.17 기준 LTS 버전 입니다
FROM node:14
# MAINTAINER argon1025@gmail.com

# 각명령어의 디렉토리 위치는 매번 초기화 되기 때문에
# 기본 디렉토리를 생성하고 해당 디렉토리로 위치를 고정 합니다
WORKDIR /usr/src/app

# 앱 의존성 설치
# package.json과 package-lock.json을 모두 복사
# COPY package*.json ./
# RUN npm install
# 앱 소스 추가
COPY ./ ./
RUN npm install

# 포트 오픈 - docker compose 에서 관리
EXPOSE 8001

# 서버 실행
CMD [ "node", "index.js" ]