#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_FILE="$PROJECT_ROOT/frontend/src/app/globals.css"

if [[ ! -f "$TARGET_FILE" ]]; then
  echo "FAIL: Missing file $TARGET_FILE"
  exit 1
fi

if awk '
  BEGIN { in_body = 0; found = 0 }
  /^[[:space:]]*body[[:space:]]*\{/ { in_body = 1; next }
  in_body && /^[[:space:]]*\}/ { in_body = 0 }
  in_body && /overflow[[:space:]]*:[[:space:]]*hidden[[:space:]]*;/ { found = 1 }
  END { exit found ? 0 : 1 }
' "$TARGET_FILE"; then
  echo "PASS: body includes overflow: hidden in frontend/src/app/globals.css"
else
  echo "FAIL: body missing overflow: hidden in frontend/src/app/globals.css"
  exit 1
fi
