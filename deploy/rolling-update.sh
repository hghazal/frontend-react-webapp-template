#! /bin/bash
ROLLING_UPDATE_SELECTOR=roller-webapp
ROLLING_UPDATE_PERIOD=1s
ROLLING_UPDATE_TEMPLATE=kubernetes/$ROLLING_UPDATE_SELECTOR-rc-rolling-update.yaml

################################################################################
#      DON'T CHANGE THE FOLLOWING UNLESS YOU KNOW WHAT YOU'RE DOING ;-)
################################################################################
# Exit on any error
set -e

KUBE_CMD=kubectl
SOURCE_DIR=`pwd`
cd `dirname $0`/..
HOTFIX=$1
GIT_SHA1=$(git rev-parse HEAD | cut -c1-15)
GIT_SHA1=$GIT_SHA1$HOTFIX
CURRENT_RC=$($KUBE_CMD get rc --selector=app=$ROLLING_UPDATE_SELECTOR --output='jsonpath={.items[*].metadata.name}')
cp $ROLLING_UPDATE_TEMPLATE deploy-rc.yaml && \
sed -i.bak s/VERSION/$GIT_SHA1/g deploy-rc.yaml && \
$KUBE_CMD rolling-update $CURRENT_RC --show-all --update-period=$ROLLING_UPDATE_PERIOD -f deploy-rc.yaml && \
rm deploy-rc.yaml*
cd $SOURCE_DIR
