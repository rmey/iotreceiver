FROM alpine:3.4

RUN mkdir /myapp/
COPY ./server.js /myapp/
COPY ./package.json /myapp/

WORKDIR /myapp
# sqeeze to 32 MByte
RUN apk add --update nodejs git && npm install && rm -rf /usr/lib/node_modules && apk del git && rm -rf /root
EXPOSE 8000

CMD ["node", "/myapp/server.js"]
