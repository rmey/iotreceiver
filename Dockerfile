FROM alpine:3.4

RUN mkdir /myapp/
COPY ./*.js /myapp/
COPY ./package.json /myapp/

WORKDIR /myapp
# sqeeze to 32 MByte
RUN apk add --update nodejs python && npm install && rm -rf /usr/lib/node_modules && apk del python && rm -rf /root
EXPOSE 8000

CMD ["node", "/myapp/server.js"]
