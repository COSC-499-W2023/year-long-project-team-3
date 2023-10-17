FROM node:16

WORKDIR /app

COPY . .
# need to ignore scripts so husky doesn't get run
RUN npm install --production --ignore-scripts
RUN npm run build
CMD ["npm", "start"]
