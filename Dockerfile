FROM node:13
USER node
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]