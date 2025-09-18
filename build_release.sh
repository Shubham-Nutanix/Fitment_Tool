#!/usr/bin/env bash
set -euo pipefail

echo "== NDB PreCheck: Build and Package (Windows) =="

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

if ! command -v go >/dev/null 2>&1; then
  echo "error: Go is not installed or not in PATH" >&2
  exit 1
fi

WEBAPP_DIST="$REPO_ROOT/webapp/dist"
if [ ! -d "$WEBAPP_DIST" ]; then
  echo "error: missing 'webapp/dist'. Build your webapp first (e.g., 'npm run build')." >&2
  exit 1
fi

RELEASE_ROOT="$REPO_ROOT/release"
RELEASE_DIR="$RELEASE_ROOT/ndb-precheck"
RELEASE_WEBAPP_DIR="$RELEASE_DIR/webapp/dist"
ZIP_PATH="$RELEASE_ROOT/ndb-precheck.zip"

mkdir -p "$RELEASE_DIR" "$RELEASE_WEBAPP_DIR"

echo "Building Windows amd64 executable..."
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -o "$RELEASE_DIR/ndb-precheck.exe" "$REPO_ROOT/main.go"

echo "Staging script and web assets..."
cp -f "$REPO_ROOT/script.ps1" "$RELEASE_DIR/"
rsync -a --delete "$WEBAPP_DIST/" "$RELEASE_WEBAPP_DIR/" 2>/dev/null || {
  # Fallback if rsync not available
  rm -rf "$RELEASE_WEBAPP_DIR" && mkdir -p "$RELEASE_WEBAPP_DIR"
  cp -a "$WEBAPP_DIST/." "$RELEASE_WEBAPP_DIR/"
}

echo "Creating zip archive..."
rm -f "$ZIP_PATH"
(
  cd "$RELEASE_DIR"
  # zip with deterministic structure
  if command -v zip >/dev/null 2>&1; then
    zip -r -q "$ZIP_PATH" .
  else
    # macOS has ditto by default
    ditto -c -k --sequesterRsrc --keepParent . "$ZIP_PATH"
  fi
)

echo
echo "Package contents:"
find "$RELEASE_DIR" -type f -maxdepth 3 -print | sed "s|$RELEASE_DIR/||"

echo
echo "Created: $ZIP_PATH"


