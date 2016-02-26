#! /bin/bash
npm run build
docker rm -f app
gcloud docker pull us.gcr.io/roller-io/roller-webapp:latest
docker run \
  -p 3000:3000 \
  --name app \
  --env="PORT=3300" \
  -ti \
  us.gcr.io/roller-io/roller-webapp:latest \
  bash -c "nginx && echo -e '\n\n\n===> 🌎   Open Browser to http://`docker-machine ip $DOCKER_MACHINE_NAME`:3000\n\n' && npm start"
