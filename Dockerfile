FROM node:5.7

RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
# RUN echo "daemon off;" >> /etc/nginx/nginx.conf


ENV     PACKAGE_PATH /src
RUN     mkdir -p $PACKAGE_PATH
WORKDIR $PACKAGE_PATH

COPY    . $PACKAGE_PATH
# RUN     npm install --production
RUN     npm install
RUN     npm run build
RUN     rm -rf /etc/nginx/sites-enabled/*
RUN     ln -s $PACKAGE_PATH/nginx/default.conf /etc/nginx/sites-enabled/

EXPOSE 3000 3300 3301
