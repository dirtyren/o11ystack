#!/usr/bin/env bash
# Build the Langfuse web image with the /langfuse base path baked in.
#
# Langfuse inlines NEXT_PUBLIC_BASE_PATH into its static assets at build time,
# so the prebuilt langfuse/langfuse:4 image CANNOT be served under /langfuse.
# The worker image is base-path agnostic and uses the official image.
#
# Usage: scripts/build-langfuse-web.sh
set -euo pipefail

SRC_DIR="${LANGFUSE_SRC_DIR:-/var/lib/o11ystack/langfuse-src}"
IMAGE="${LANGFUSE_WEB_IMAGE:-o11ystack/langfuse-web:4-langfuse-path}"
BASE_PATH="${LANGFUSE_BASE_PATH:-/langfuse}"

if [ ! -d "$SRC_DIR/.git" ]; then
  mkdir -p "$(dirname "$SRC_DIR")"
  git clone --depth 1 -b production https://github.com/langfuse/langfuse.git "$SRC_DIR"
else
  git -C "$SRC_DIR" fetch --depth 1 origin production
  git -C "$SRC_DIR" checkout --detach FETCH_HEAD
fi

# Upstream builds Next.js with --max-old-space-size-percentage=75, which sizes
# the V8 heap off *total* host RAM and (combined with turbo's default fan-out
# and browser source maps) OOM-kills the build on hosts <= 16 GB. Cap the heap
# explicitly and build workspace packages one at a time.
# Override with LANGFUSE_BUILD_HEAP_MB / LANGFUSE_BUILD_CONCURRENCY.
HEAP_MB="${LANGFUSE_BUILD_HEAP_MB:-4096}"
CONCURRENCY="${LANGFUSE_BUILD_CONCURRENCY:-1}"
sed -i "s/--max-old-space-size-percentage=[0-9]*/--max-old-space-size=${HEAP_MB}/" "$SRC_DIR/web/Dockerfile"
# Two more tweaks so the build fits on small hosts:
#  - productionBrowserSourceMaps: the web app ships source maps for the whole
#    bundle, which is the single largest memory consumer in `next build`.
#    Our self-hosted deployment doesn't need browser source maps.
#  - turbo builds workspace packages one at a time (default fan-out spikes RSS).
sed -i 's/productionBrowserSourceMaps: true/productionBrowserSourceMaps: false/' "$SRC_DIR/web/next.config.mjs"
sed -i "s|turbo run build --filter=web\.\.\.|turbo run build --concurrency=${CONCURRENCY} --filter=web...|" "$SRC_DIR/web/Dockerfile"

docker build \
  -t "$IMAGE" \
  --build-arg "NEXT_PUBLIC_BASE_PATH=${BASE_PATH}" \
  -f "$SRC_DIR/web/Dockerfile" \
  "$SRC_DIR"

echo "Built ${IMAGE} with base path ${BASE_PATH}"
