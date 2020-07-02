FROM node:14.4-alpine AS dev

# Install pm2 for serving static content
RUN npm install -g pm2

# Make the 'app' folder the current working directory
# In dev stage, the application source directory should be mounted at /app
WORKDIR /app

RUN npm install

CMD [ "pm2-dev", "index.js"]