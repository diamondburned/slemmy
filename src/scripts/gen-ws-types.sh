#!/usr/bin/env bash
LEMMY_JS_CLIENT_SRC="https://raw.githubusercontent.com/LemmyNet/lemmy-js-client/main/src"

generate() {
	prefix=lemmy

	declare -A requestResponses
	while read -r request response; do
		requestResponses["$prefix.$request"]="$prefix.$response"
	done < <(
		curl -s "$LEMMY_JS_CLIENT_SRC/http.ts" \
			| sed -n 's|.*return this.#wrapper<\(.*\), \(.*\)>(.*|\1\t\2|p')

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

generate > src/lib/lemmyws.types.ts
prettier --write src/lib/lemmyws.types.ts
