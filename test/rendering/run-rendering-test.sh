#!/bin/sh

# To stop execution instantly as a query exits while having a non-zero status
# To know the error location in the running code
set -e

# Install dependencies
yarn --frozen-lockfile

# Build nebula.js visualization:
yarn build

# Create and start the container with the name *sn-tale-playwright*
# using the Docker host network stack and binding your current directory
# in the background in a “detached” mod and remove the container once it exits/stops
# The -it instructs Docker to allocate a pseudo-TTY connected to the container’s stdin;
# creating an interactive bash shell in the container
docker run -d --name sn-tale-playwright  --rm --network host -v $(pwd):/work/ -w /work/ -it mcr.microsoft.com/playwright:v1.19.2-focal

# The actual rendering test is running from the machine running this shell script
docker exec sn-tale-playwright /bin/sh -c "yarn test:rendering"

docker stop sn-tale-playwright
