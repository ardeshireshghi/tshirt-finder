FROM node:16.4.2-buster-slim

# See: https://github.com/buildkite/docker-puppeteer/blob/master/Dockerfile
RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates procps libxss1 \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     # We install Chrome to get all the OS level dependencies, but Chrome itself
     # is not actually used as it's packaged in the node puppeteer library.
     # Alternatively, we could could include the entire dep list ourselves
     # (https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix)
     # but that seems too easy to get out of date.
     && apt-get install -y google-chrome-stable git \
     && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/app

COPY package.json .
COPY yarn.lock .
COPY ./docker/entrypoint.sh entrypoint.sh

# Install all Packages
RUN NODE_ENV=production yarn install --production --frozen-lockfile

# Copy all other source code to work directory
COPY . /opt/app

# TypeScript
RUN yarn

# Start
CMD [ "yarn", "start" ]

ENTRYPOINT [ "./entrypoint.sh" ]