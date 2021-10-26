FROM node:alpine
WORKDIR gachi-bot
RUN apk add ffmpeg

COPY . .
RUN npm install

CMD yarn start

