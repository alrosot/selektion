#/bin/bash

docker build -t selektion .
docker run -p 3000:3000 -v $1:/images selektion