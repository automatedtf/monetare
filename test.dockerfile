FROM node:17-alpine
COPY . .

RUN npm install
CMD npm test