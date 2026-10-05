#!/usr/bin/env bash
#
# Point the deployed Jaynepal chat app at a running inference server.
#
#   ./scripts/connect-model.sh https://your-tunnel.trycloudflare.com
#
# This exists because the model server URL is ephemeral. A Kaggle session caps at
# 12 hours, so the tunnel hostname changes every time the notebook restarts, and
# a value that has to be pasted into a dashboard several times a day will
# eventually be pasted wrong. One command instead.
#
# Options:
#   --project <name>   Vercel project to use (default: jaynepal-chat)
#   --skip-check       Do not probe the URL before setting it
#   --no-deploy        Set the variable but do not redeploy
#   --show             Print the current configuration and exit

set -euo pipefail

URL=""
PROJECT="jaynepal-chat"
SKIP_CHECK=0
NO_DEPLOY=0
SHOW=0

while [ $# -gt 0 ]; do
  case "$1" in
    --project)    PROJECT="${2:?--project needs a value}"; shift 2 ;;
    --skip-check) SKIP_CHECK=1; shift ;;
    --no-deploy)  NO_DEPLOY=1; shift ;;
    --show)       SHOW=1; shift ;;
    -h|--help)    sed -n '3,16p' "$0" | sed 's/^#\{1,\} \{0,1\}//'; exit 0 ;;
    -*)           echo "Unknown option: $1" >&2; exit 2 ;;
    *)            URL="$1"; shift ;;
  esac
done

if ! command -v vercel >/dev/null 2>&1; then
  echo "error: the Vercel CLI is not installed. Run: npm i -g vercel" >&2
  exit 1
fi

# Every vercel command below runs from the linked project root rather than
# passing a bare project name as a positional — the CLI's positional handling
# differs between subcommands, and the link file is unambiguous.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [ "$SHOW" = "1" ]; then
  cd "$ROOT"
  echo "Project dir : $ROOT"
  echo "Account     : $(vercel whoami 2>/dev/null || echo 'not signed in')"
  echo
  if [ -f .vercel/project.json ]; then
    vercel env ls 2>/dev/null | grep -i jaynepal || echo "JAYNEPAL_API_URL is not set."
  else
    echo "Not linked to a Vercel project yet (no .vercel/project.json)."
  fi
  exit 0
fi

if [ -z "$URL" ]; then
  echo "usage: $0 <inference-server-url> [--project <name>]" >&2
  echo "       $0 --show" >&2
  exit 2
fi

# ---- validate -------------------------------------------------------------
case "$URL" in
  http://*)  echo "warning: http:// — the upstream will be plaintext" >&2 ;;
  https://*) ;;
  *) echo "error: URL must start with https:// (got: $URL)" >&2; exit 2 ;;
esac

# Trailing slash stripped so the proxy does not build a double slash.
URL="${URL%/}"
HOST=$(printf '%s' "$URL" | sed -E 's#^https?://([^/]+).*#\1#')

# ---- probe ----------------------------------------------------------------
# A dead URL is not this script's failure, but it IS a failure the user would
# otherwise meet later as a confusing chat error. Better to say it here.
if [ "$SKIP_CHECK" = "0" ]; then
  echo "Probing https://$HOST/v1/models ..."
  CODE=$(curl -sS --max-time 15 -o /tmp/jp_probe.$$ -w '%{http_code}' \
           "$URL/v1/models" 2>/dev/null || echo "000")

  if [ "$CODE" = "200" ]; then
    echo "  reachable (HTTP 200)"
    head -c 200 /tmp/jp_probe.$$ 2>/dev/null | sed 's/^/  /' || true
    echo
  else
    echo "  warning: the server answered '$CODE' (expected 200)." >&2
    if [ "$CODE" = "000" ]; then
      echo "  The host did not resolve, or refused the connection." >&2
      echo "  A trycloudflare URL dies with its notebook session — is the notebook still running?" >&2
    fi
    printf '  Continue anyway? [y/N] '
    read -r reply < /dev/tty || reply="n"
    case "$reply" in
      [yY] | [yY][eE][sS]) ;;
      *) echo "Aborted. Nothing was changed."; rm -f /tmp/jp_probe.$$; exit 1 ;;
    esac
  fi
  rm -f /tmp/jp_probe.$$
fi

# ---- apply ----------------------------------------------------------------
cd "$ROOT"

if [ ! -f .vercel/project.json ]; then
  echo "Linking this directory to the Vercel project '$PROJECT' ..."
  vercel link --yes --project "$PROJECT"
fi

echo "Setting JAYNEPAL_API_URL (production) ..."
# The CLI has no "set or update", so remove first — ignoring the case where the
# variable does not exist yet.
vercel env rm JAYNEPAL_API_URL production --yes >/dev/null 2>&1 || true
printf '%s' "$URL" | vercel env add JAYNEPAL_API_URL production >/dev/null

# Read it back. Storing the wrong value (a trailing slash, a pasted prompt) is
# the failure mode this catches, and it is invisible otherwise.
TMP="$(mktemp)"
if vercel env pull --environment=production "$TMP" >/dev/null 2>&1 &&
   grep -q '^JAYNEPAL_API_URL=' "$TMP"; then
  echo "  stored: $(grep '^JAYNEPAL_API_URL=' "$TMP")"
else
  echo "  stored (could not read back — check the dashboard)"
fi
rm -f "$TMP"

if [ "$NO_DEPLOY" = "1" ]; then
  echo
  echo "Skipping redeploy. Run 'vercel deploy --prod' when ready."
  exit 0
fi

echo
echo "Redeploying so the new value takes effect ..."
vercel deploy --prod --yes 2>&1 | tail -8

echo
echo "Done. Confirm the model status with:"
echo "  curl https://jaynepal-chat.vercel.app/api/health"
