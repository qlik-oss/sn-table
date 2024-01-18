#!/bin/bash -x

# To stop execution instantly as a query exits while having a non-zero status
# To know the error location in the running code
set -e

container_started=false

function stopContainer() {
  echo "stop the container"
  [ "$container_started" == "true" ] && docker stop sn-table-playwright
}

trap stopContainer EXIT

# Get the version of the installed @playwright/test
playwrightVersion=$(npm list @playwright/test | awk '{print $2}' | cut -d "@" -f3 | sed -n 2p)

# Create and start the container with the name *sn-table-playwright*
# using the Docker host network stack and binding your current directory
# in the background in a “detached” mod and remove the container once it exits/stops
# The -it instructs Docker to allocate a pseudo-TTY connected to the container’s stdin;
# creating an interactive bash shell in the container
docker run -d --name sn-table-playwright --rm --network host -v $(pwd):/work/ -w /work/ -it mcr.microsoft.com/playwright:v$playwrightVersion-focal

container_started=true

# The actual rendering test is running from the machine running this shell script
docker exec sn-table-playwright /bin/sh -c "pnpm test:rendering $@"
