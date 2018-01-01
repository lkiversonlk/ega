#!/bin/bash

#npm install uglify-js -g

#compress js

for js_file in public/javascripts/*.js
do
  echo "compress $js_file to public/dist/javascripts/$(basename $js_file)"
  node_modules/uglify-es/bin/uglifyjs "$js_file" -c -m -o public/dist/javascripts/$(basename $js_file)
done
# connect to local mongo
# create eegalaxy database
# create grid collection
# create player collection