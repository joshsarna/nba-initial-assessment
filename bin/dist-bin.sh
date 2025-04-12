FILE=${1/src/dist}
FILE=${FILE/.ts/.js}

node $FILE "${@:2}"