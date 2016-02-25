#! /bin/bash

set -e

PROJECT=roller-io
ZONE=us-east1-c

CURRENT_PWD=$(pwd)
cd $HOME
echo $GCR_JSON_KEY > json_key
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-96.0.0-linux-x86_64.tar.gz
tar xvf google-cloud-sdk-96.0.0-linux-x86_64.tar.gz

source $HOME/google-cloud-sdk/path.bash.inc
gcloud components install kubectl -q
gcloud auth activate-service-account circleci@roller-io.iam.gserviceaccount.com --key-file json_key
docker login -e circleci@roller-io.iam.gserviceaccount.com -u _json_key -p "$GCR_JSON_KEY" https://gcr.io
rm json_key
gcloud config set project $PROJECT
gcloud config set compute/zone $ZONE
gcloud container clusters get-credentials roller-prod

cd $CURRENT_PWD
