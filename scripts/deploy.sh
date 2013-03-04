#!/bin/sh

current=`pwd`
distdir="$current-dist"
remote=heroku

echo "=====> Compiling application..."; echo
grunt build || exit 1

echo; echo "=====> Actualizing and merging..."; echo
cd $distdir || exit 1
git pull --rebase $remote master
mkdir -p ./public
cp -rf $current/dist/* ./public

version=`cat VERSION`
new_version=$(($version+1))

echo; echo "=====> Deploying v$new_version to $remote..."; echo
echo $new_version > VERSION
git add .
git add -u .
git commit -m "Release $new_version" && git push $remote master

echo; echo "=====> Going back to project..."; echo
cd $current