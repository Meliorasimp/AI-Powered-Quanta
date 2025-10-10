# syntax=docker/dockerfile:1.7
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./ 
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy all files
COPY . .

# Build (Vite outputs to dist/)
ENV NODE_ENV=production
RUN npm run build

#Runtime stage (pure static hosting)
FROM nginx:1.27-alpine AS runtime
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/site.conf
RUN adduser -D app \
    && mkdir -p /var/cache/nginx /var/run /var/log/nginx /run \
    && chown -R app:app /usr/share/nginx/html /var/cache/nginx /var/run /var/log/nginx /run
USER app
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=2s --start-period=10s --retries=3 \
CMD wget -q -O - http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
