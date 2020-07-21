# Develop guide

- TODO npm init eleva  For now we can only git clone this basic skeleton framework and start develop.

- To start a development mode

  npm run dev

- To make a build installer deliver

  npm run build

> NODE_ENV

We have two project's NODE_ENV product and develop with webpack product and develop mode.

- Production mode

  process.env.NODE_ENV = 'production'

  global.__static has been assigned to static folder

- Develop mode

  process.env.NODE_ENV = 'development'
  We use webpack predefine plugin to setup static:  '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`,

> appid
 'appId': `"${build.appId}"`  we setup the appid according to appId config in package.json


> Renderer global Config

  There have a config folder under root path which is loaded in renderer processing. It's configured in webpack.renderer.config.js.

  ```javascript
new webpack.DefinePlugin({
      'process.env': process.env.NODE_ENV === 'production' ? config.prod.env : config.dev.env
    }),
  ```


## Project structure

```linux
-rw-r--r-- 1 shawn 1049089     54 7月  20 17:02 app-update.yml
-rw-r--r-- 1 shawn 1049089    415 3月  19 15:48 appveyor.yml
drwxr-xr-x 1 shawn 1049089      0 7月   6 09:36 build/
drwxr-xr-x 1 shawn 1049089      0 7月   6 09:36 config/
drwxr-xr-x 1 shawn 1049089      0 7月   6 09:36 dist/
drwxr-xr-x 1 shawn 1049089      0 7月  21 10:52 docs/
drwxr-xr-x 1 shawn 1049089      0 7月   6 09:36 extra/
drwxr-xr-x 1 shawn 1049089      0 7月  20 16:00 node_modules/
-rw-r--r-- 1 shawn 1049089   5996 7月  20 17:03 package.json
-rw-r--r-- 1 shawn 1049089 691479 7月  20 16:00 package-lock.json
-rw-r--r-- 1 shawn 1049089   1318 7月  21 10:50 README.md
drwxr-xr-x 1 shawn 1049089      0 7月   6 09:40 release/
drwxr-xr-x 1 shawn 1049089      0 7月   6 09:40 src/
drwxr-xr-x 1 shawn 1049089      0 7月  20 17:48 static/
-rw-r--r-- 1 shawn 1049089 400654 3月  19 15:50 yarn.lock
```

## electron-vue config

We have a folder name .electron-vue which is the project webpack config entrance.

- webpack.main.config.js

  It is the Electron main process entrance config file

- webpack.renderer.config.js

  It is the Electron render process entrance config file

```linux
-rw-r--r-- 1 shawn 1049089 3058 3月  19 15:48 build.js
-rw-r--r-- 1 shawn 1049089 1205 3月  19 15:48 dev-client.js
-rw-r--r-- 1 shawn 1049089 4616 3月  19 15:48 dev-runner.js
-rw-r--r-- 1 shawn 1049089 1916 6月  12 14:35 webpack.main.config.js
-rw-r--r-- 1 shawn 1049089 6497 7月  15 13:55 webpack.renderer.config.js
-rw-r--r-- 1 shawn 1049089 4073 4月   1 17:14 webpack.web.config.js

```

## static folder

We have setup __static global variable point to this static folder under root path. It can be accessed by main process and renderer process too.


## auto upgrade

We use electron-update model to setup the app auto upgrade.

- Development mode

In development, we use app-update.yml file to config the auto upgrade server info.

``` yml
provider: generic
url: 'https://<domain>/autoupdate/'
```

- Production mode

In production, we setup the auto upgrade info in the package.json

```json
    "publish": [
      {
        "provider": "generic",
        "url": "https://<domain>/autoupdate/"
      }
    ]
```

## extra folder

As usual once we need extra data to be depended in project, we can put them on it. Which can be build into the setup install when build the project. Like for example we put aria2c engin in it as the sample.

We use electron-build to add the extra resouces from this folder.

```json
      "extraResources": {
        "from": "./extra/win32/",
        "to": "./",
        "filter": [
          "**/*"
        ]
```
