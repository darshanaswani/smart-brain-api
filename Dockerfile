FROM node:alpine

WORKDIR /usr/src/smart-brain-api

COPY ./package.json ./

RUN npm install

COPY . .
