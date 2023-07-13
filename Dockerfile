FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@8.6.7 --activate
RUN apk add nginx --update
RUN npm install pm2@latest -g

RUN adduser -D -g 'www' www
RUN mkdir -p /usr/src/app && chown -R www:www /usr/src/app

WORKDIR /usr/src/app

#RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -

COPY --chown=www ./apps ./apps
COPY --chown=www ./packages ./packages
COPY --chown=www .prettierrc package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
USER www
RUN pnpm install
RUN pnpm exec turbo run build

USER root
COPY nginx.conf ecosystem.config.js ./

EXPOSE 80 8080
STOPSIGNAL SIGQUIT
CMD npx pm2 start ecosystem.config.js && nginx -c /usr/src/app/nginx.conf -g "daemon off;"
