FROM node:14-alpine AS development
ENV NODE_ENV development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000

FROM nginx:alpine as production
ENV NODE_ENV production
COPY --from=development /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
