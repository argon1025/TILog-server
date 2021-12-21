#!/bin/bash
# env file 생성

SCRIPTS_PATH="$( cd "$( dirname "$0" )" && pwd -P )"
echo "${SCRIPTS_PATH}"
mappings=()
while IFS= read -r line; do
 mappings+=("$line")
done < "$SCRIPTS_PATH/envSettings.txt"

for value in "${mappings[@]}" ; do
 prefix=${value#*=};
 env_path=${value%=*};
 echo "${prefix} ${env_path}"
 rm -f "$env_path" && for l in $(printenv | grep ^"$prefix"); do echo ${l#$prefix} >> "$env_path"; done
done