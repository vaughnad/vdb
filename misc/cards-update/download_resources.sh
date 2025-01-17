#!/bin/sh
# Download resources for cards/twda updates
wget https://www.vekn.net/images/stories/downloads/vtescsv_utf8.zip -O vtescsv_utf8.zip
unzip -q -o vtescsv_utf8.zip
rm vtescsv_utf8.zip vtessets.csv

wget https://www.vekn.net/images/stories/downloads/french/vtescsv_utf8.fr-FR.zip -O vtescsv_utf8.fr-FR.zip
wget https://www.vekn.net/images/stories/downloads/spanish/vtescsv_utf8.es-ES.zip -O vtescsv_utf8.es-ES.zip
unzip -q -o vtescsv_utf8.fr-FR.zip
unzip -q -o vtescsv_utf8.es-ES.zip
rm vtescsv_utf8.fr-FR.zip vtescsv_utf8.es-ES.zip vtessets.fr-FR.csv vtessets.es-ES.csv

wget https://static.krcg.org/data/vtes.json -O vtes.json
wget https://static.krcg.org/data/twda.json -O twda.json
