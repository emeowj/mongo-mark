# Mongodb with docker-compose

## Create env file for mongodb

Create a `local.env` file under directory `mongodb` for local development and other env files for other environment you might have (e.g. `production.env` for production).

The file should contain 2 environment variables used by mongodb to initialize the db:

```env
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=foo_bar_2
```

Be aware that this and other env files should never be checked into VCS such as Git, so remember to add those files to `.gitignore` file.

## Setting up new instance using `docker-compose`

```yml
version: '3.6'

services:
  mongodb-dev:
    container_name: mongo
    image: 'mongo:4.2.2'
    env_file:
      - ./mongodb/local.env
    command:
      - '--auth'
    volumes:
      - mongodb:/data/db
    ports:
      - '27017-27019:27017-27019'

volumes:
  mongodb:
```

`--auth` command starts the db with authentication enabled.

The above example uses the short volumes syntax to create a persistent volume to store db data. A persistent volume ensures that data in the db are kept between restarts.

We can use `docker volume` command to inspect this volume:

```bash
$ docker volume list
DRIVER              VOLUME NAME
local               mongo-mark_mongodb
$ docker volume inspect mongo-mark_mongodb
[
    {
        "CreatedAt": "2020-07-01T17:25:00-07:00",
        "Driver": "local",
        "Labels": {
            "com.docker.compose.project": "mongo-mark",
            "com.docker.compose.version": "1.26.1",
            "com.docker.compose.volume": "mongodb"
        },
        "Mountpoint": "/var/lib/docker/volumes/mongo-mark_mongodb/_data",
        "Name": "mongo-mark_mongodb",
        "Options": null,
        "Scope": "local"
    }
]
```

## Setup application user and databases

Once the db is created, connect to it by running:

```bash
docker exec -it name_of_the_container bash
```

TIP: use `docker ps` to find the name of the mongodb container.

This will enter attach a bash session to the container, inside the container, run `mongo`:

```bash
roo@35afe30de02:/# mongo

> use admin
> db.auth('root', 'foo_$Bar');
> db.createUser({
    user: 'app',
    pwd: 'app_pwd',
    roles: [{
        role: 'readWrite',
        db: 'my-app'
    }]
  });
```

This will create a new user with read and write permission for db `my-app`.

## Connect to mongodb instance in other services

Now we can connect to this database with the following URL

```js
mongodb://app:app_pwd@localhost:27017/?authSource=admin
```

If we were to connect to the db inside a container, we need to replace `localhost` with the container name:

```js
mongodb://app:app_pwd@mongo:27017/?authSource=admin
```
