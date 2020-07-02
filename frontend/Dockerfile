FROM node:14.4-alpine AS dev

# Make the 'app' folder the current working directory
# This expect the actual application directory from host to be mounted at /app
WORKDIR /app

RUN npm install

CMD npm run serve