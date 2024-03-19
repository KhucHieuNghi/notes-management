FROM node:18-alpine AS base

COPY . .

RUN yarn install & yarn build

EXPOSE 3000

CMD ["yarn", "start"]