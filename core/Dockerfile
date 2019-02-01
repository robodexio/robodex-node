FROM node
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY src ./
CMD node app.js
