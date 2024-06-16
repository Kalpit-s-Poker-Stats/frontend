# Stage 1: Build Angular application
FROM node:16 AS build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . .
RUN npm cache clean --force
RUN npm run build -- --verbose

# Stage 2: Serve Angular application with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]