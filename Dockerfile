# syntax=docker/dockerfile:1.7

############################
#  Build stage
############################
FROM node:20-alpine AS build

WORKDIR /app

# Use pnpm via corepack (faster & reproducible)
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Only copy files needed to install & build
COPY package.json pnpm-lock.yaml* ./
COPY tsconfig*.json vite.config.ts ./
COPY index.html ./
COPY src ./src

# Install deps & build
RUN pnpm install --frozen-lockfile
RUN pnpm run build

############################
#  Runtime stage
############################
FROM nginx:1.27-alpine AS runtime

# Nginx will env-subst templates at startup
# (Official nginx image looks for *.template in /etc/nginx/templates)
ENV LISTEN_PORT=8080
# Default backend; override at `docker run`/compose
ENV API_ORIGIN=http://backend:8080

# Copy build artifacts
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx template with env vars
COPY ops/nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Optional: gzip on globally
RUN printf '\nhttp { gzip on; gzip_types text/plain text/css application/javascript application/json image/svg+xml; }\n' \
    >> /etc/nginx/nginx.conf

EXPOSE 8080

# Use nginx entrypoint; it will process templates & start Nginx
CMD ["nginx", "-g", "daemon off;"]
