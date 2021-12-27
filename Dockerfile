FROM node:17-slim

LABEL maintainer=pierrick.libert@gmail.com

RUN apt-get update && apt-get upgrade -y && apt-get install -y gcc postgresql postgresql-client libpq-dev && apt-get clean -y
COPY package.json .
RUN npm install --only production

WORKDIR /api
# Copy the rest of the files
COPY . /api

ENTRYPOINT ["sh", "setup.sh", "8083"]
