FROM node:8-alpine

RUN npm install sharp

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

EXPOSE 3000
CMD [ "npm", "start" ]