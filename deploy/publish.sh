#! /bin/bash
PROJECT_NAME=roller-io
DOCKER_REPO=roller-webapp
DOCKERFILE_PATH=../

################################################################################
#      DON'T CHANGE THE FOLLOWING UNLESS YOU KNOW WHAT YOU'RE DOING ;-)
################################################################################
# Exit on any error
set -e

SOURCE_DIR=`pwd`
cd `dirname $0`/
HOTFIX=$1
GIT_SHA1=$(git rev-parse HEAD | cut -c1-15)
GIT_SHA1=$GIT_SHA1$HOTFIX
docker build -t us.gcr.io/$PROJECT_NAME/$DOCKER_REPO:latest $DOCKERFILE_PATH && \
gcloud docker push us.gcr.io/$PROJECT_NAME/$DOCKER_REPO:latest && \
docker tag -f us.gcr.io/$PROJECT_NAME/$DOCKER_REPO:latest us.gcr.io/$PROJECT_NAME/$DOCKER_REPO:$GIT_SHA1 && \
gcloud docker push us.gcr.io/$PROJECT_NAME/$DOCKER_REPO:$GIT_SHA1
cd $SOURCE_DIR
