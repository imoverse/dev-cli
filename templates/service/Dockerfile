FROM node:12.3.1-alpine

ARG NPM_TOKEN

WORKDIR /app
COPY . /app

RUN echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" > ~/.npmrc
RUN npm install

EXPOSE 3000
CMD npm start
