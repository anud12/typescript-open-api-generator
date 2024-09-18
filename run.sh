#!/usr/bin/sh
files=`cd ./input-json && ls -a *.json`
rm -r ./output
for file in $files
do
  prefix=${file//"."/"_"}
  prefix=${prefix//"-"/"_"}
  prefix=${prefix//"("/"_"}
  prefix=${prefix//")"/"_"}
  prefix=${prefix//" "/"_"}
  prefix=${prefix^^}
  mkdir -p ./output/$prefix
  npm start -- --prefix $prefix --output ./output/$prefix ./input-json/$file
done