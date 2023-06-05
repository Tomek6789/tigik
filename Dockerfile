FROM node:16-buster
EXPOSE 4000
EXPOSE 5000
EXPOSE 5001
EXPOSE 9000
EXPOSE 9099
RUN apt update
RUN apt install default-jdk -y
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . . 
CMD ["npm", "run", "firebase:backend"] 
