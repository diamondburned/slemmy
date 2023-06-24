#!/usr/bin/env bash

depVersion() {
	local v
	v=$(jq -r ".devDependencies.\"$1\"" package.json)
	v=${v#^}
	echo "$v"
}

LEMMY_JS_CLIENT_VERSION=$(depVersion "lemmy-js-client")
LEMMY_JS_CLIENT_SRC="https://raw.githubusercontent.com/LemmyNet/lemmy-js-client/$LEMMY_JS_CLIENT_VERSION/src"

generate() {
	prefix=lemmy
	srcHttp=$(curl -s "$LEMMY_JS_CLIENT_SRC/http.ts")
	if [[ "$srcHttp" == "" ]]; then
		echo "Failed to fetch $LEMMY_JS_CLIENT_SRC/http.ts, skipping..."
		return
	fi

	declare -A requestResponses
	while read -r request response; do
		requestResponses["$prefix.$request"]="$prefix.$response"
	done < <(
		echo "$srcHttp" | sed -n 's|.*return this.#wrapper<\(.*\), \(.*\)>(.*|\1\t\2|p')

	declare -a requests
	while read -r request; do
		requests+=("$request")
	done < <(
		curl -s "$LEMMY_JS_CLIENT_SRC/websocket.ts" \
			| sed -n 's|.*return wrapper(UserOperation.\(.*\), .*|\1|p'
	)

	echo '// Generated using ./src/scripts/gen-ws-types.sh'
	echo
	echo 'import { UserOperation } from "lemmy-js-client"'
	echo 'import type * as '"$prefix"' from "lemmy-js-client"'
	echo
	echo "type a = {"
	for request in "${requests[@]}"; do
		echo "  [UserOperation.$request]: ["
		echo "    $prefix.$request,"
		echo "    ${requestResponses[$prefix.$request]:-unknown},"
		echo "  ],"
	done
	echo "}"
	echo "export type { a as default }"
}

temp=$(mktemp --suffix=.ts)
output="src/lib/lemmyws.types.ts"

generate > "$temp"
prettier --write "$temp"

if [[ "$temp" != "$(< output)" ]]; then
	mv "$temp" "$output"
else
	rm "$temp"
fi
