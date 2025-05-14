FROM node:14-buster AS builder

COPY . /app

WORKDIR /app

RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y bash git ca-certificates python2.7 make g++ \
    && npm install -g bower \
    && npm --unsafe-perm --production install \
    && apt-get purge -y git \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
        /app/.git \
        /app/screenshots \
        /app/test \
    && useradd -r -s /usr/sbin/nologin -c "Konga service owner" -u 1200 konga \
    && mkdir -p /app/kongadata /app/.tmp \
    && chown -R 1200:1200 /app/views /app/kongadata /app/.tmp


FROM node:14-alpine AS final
COPY --from=builder /app /app
WORKDIR /app
RUN apk upgrade --update \
    && apk add bash ca-certificates \
    && npm install -g bower \
    && rm -rf /var/cache/apk/* \
        /app/.git \
        /app/screenshots \
        /app/test \
    && adduser -H -S -g "Konga service owner" -D -u 1200 -s /sbin/nologin konga \
    && chown -R 1200:1200 /app/views /app/kongadata /app/.tmp

EXPOSE 1337

VOLUME /app/kongadata

ENTRYPOINT ["/app/start.sh"]