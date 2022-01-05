# Dashboard

This project aims is to understand how web development works by developing a full-stack web application using javascript with Node and Vue.js.

We had to develop a Dashboard in 4 weeks in pairs with the possibility of integrating widgets and services.

This project was developed by **Dmitry Yakovlev and Arthur Robine.**

## Setup

This project is made to run with docker. To use it run `docker-compose build && docker-compose up`.

To use the project you will have to provide a `.env` file with the following environment variables:
- STEAM_API_KEY: steam api key
- OPENWEATHER_API_KEY: openweathermap api key
- GOOGLE_API_KEY: google api key, used by geolocation api to convert city name to latitude and longitude
- URL_MONGO: url of the database, MongoDB in this case
- MONGO_INITDB_ROOT_USERNAME: database username
- MONGO_INITDB_ROOT_PASSWORD: database password
- REDDIT_CLIENT_ID: Your reddit app's id
- REDDIT_CLIENT_SECRET: Your reddit app's secret
- REDDIT_OAUTH_CALLBACK: Callback that you filled in your reddit app parameters, will be used to gain access via OAuth
- TWITCH_CLIENT_ID: Your twitch app's id
- TWITCH_CLIENT_SECRET: Your twitch app's secret
- TWITCH_OAUTH_CALLBACK: Callback that you filled in your twitch app parameters, will be used to gain access via OAuth
- API_BASE_URL: Url of your backend api ex: http://localhost:8080/api

You will need to provide another `.env` file in /client/ with the following environment variables:
- VUE_APP_API_URL: Url of your backend api ex: http://localhost:8080/api
- VUE_APP_REDDIT_OAUTH_CALLBACK: Callback that you filled in your reddit app parameters, will be used to gain access via OAuth
- VUE_APP_TWITCH_OAUTH_CALLBACK: Callback that you filled in your twitch app parameters, will be used to gain access via OAuth

If you want to use other environment variables you can add them to this env file but they have to start with `VUE_APP_` , `NODE_ENV` or `BASE_URL` to be loaded since [Vue 3.0](https://cli.vuejs.org/guide/mode-and-env.html#environment-variables).

## Front-end

The front-end was developed using Vue.js framework with npm package manager. You can found used packages in `/client/package.json`.

It is configured to listen on port `:8081`.

## Back-end

The back-end was developed using Node.js with express to handle requests. You can found used packages in `/server/package.json`.

It is configured to listen on port `:8080`.

## Database

To set up a database we used MongoDB with basic configuration via env variables (see Setup section).

You can find data models in `/server/models`.

It is configured to listen on port `:27017`.

# Services and Widgets

### Weather

To implement weather widgets we used the [Open Weather Map API](https://openweathermap.org).
To use this service you'll need an api key that you can get for free by registering a new app.

- #### Today's weather:
    
    This widget displays the average temperature of the day, the minimum and maximum temperature and if it is going to be sunny, rainy of cloudy.
    
    Parameters:
     - refresh rate: widget's refresh rate in seconds, minimum 120.
     - city: name of the city.

### Reddit

This service works with the Reddit Api. To use this service you'll need a client id and a client secret that you can get for free by registering a new app [here](https://www.reddit.com/prefs/apps/). You can display a subreddit's information or a user information. If you sign in on the services page you can also display you account's information.

- #### Display your profile:
    
    This widget displays your username, reddit age and total karma. If you have a banner it is dislayed as widget's background.
    
    Parameters:
    - refresh rate: widget's refresh rate in seconds, minimum 120.

- #### Display a user's profile:
    
    This widget displays a user's username, reddit age and total karma. If he's got a banner it is dislayed as widget's background.
    
    Parameters:
    - refresh rate: widget's refresh rate in seconds, minimum 120.
    - username: username of the user you want to display

- #### Subreddit information:
    
    This widget displays subreddit name, description, number of followers and number of active users.
    
    Parameters:
     - refresh rate: widget's refresh rate in seconds, minimum 120.
     - subreddit name: name of the subreddit.

### Crypto

This service works with the [Messari Api](https://messari.io/api). To use this service you don't need any api key. You can display a cryptocurrency's information.

- #### Cryptocurrency:
    
    This widget displays a cryptocurrency's price in USDT, volume and open price.
    
    Parameters:
    - refresh rate: widget's refresh rate in seconds, minimum 120.
    - crypto name: cryptocurrency identifier (ex: BTC).

### Twitch

This service works with the Twitch Api. To use this service you'll need a client id and a client secret that you can get for free by registering a new app [here](https://dev.twitch.tv/console/apps). You can display most streamed categories / games or a streamer's recent clips. To use this service you will need to sign in on the services page.

- #### Most streamed games:
    
    This widget displays n most streamed categories / games.
    
    Parameters:
    - refresh rate: widget's refresh rate in seconds, minimum 120.
    - number: number of categories you want to display.

- #### Streamer's clips:
    
    This widget displays n recent clips of a streamer.
    
    Parameters:
    - refresh rate: widget's refresh rate in seconds, minimum 120.
    - number: number of clips you want to display.


### Steam

This service works with the Steam Api. To use this service you'll need an api key that you can get for free [here](https://cran.r-project.org/web/packages/CSGo/vignettes/auth.html). You can display a user's information.

- #### User information:
    
    This widget displays a user's full name, his country and links his profile url.
    
    Parameters:
    - refresh rate: widget's refresh rate in seconds, minimum 120.
    - steam Id: Steam id of the user in decimal, you can find it [here](https://www.steamidfinder.com/) (ex: 76561198017488231).


# How can I add a new service / widget ?

Our architecture was created so that you can easily add new services and widgets.

## Create a service

If your service needs that user logs in add a button to sign in that redirect's to the service sign in page on the services page. Then add a component in `/client/src/components/Widgets/{service name}`. This component has to be mounted on OAuth callback, to do so add a new route to `/client/src/router.js`.

Then add a controller in `/server/src/controllers` to handle service registration in the database and api calls.

Finally add you service to `/server/ressources/about.json` in the services array with the following format:

```json
{
    "name": "service_name",
    "widgets": []
}
```

## Create a widget

Create a vue file in `/client/src/components/Widgets/{your service}`.

Your widget has to use some functionnalities to be fully compatible with the dashboard. <br>
For a quick start with the mandatory elements there is a template at your disposal : `/client/src/components/Widgets/WidgetTemplate.vue`

Import your widget in `/client/src/components/Dashboard.vue` and add it to the availableWidgets array.

Finally add your widget to the corresponding service's widgets array in `/server/ressources/about.json` with the following format:

```json
{
    "name": "service_name",
    "widgets": [
        {
            "name": "name of the widget",
            "description": "Widget's short description",
            "params": [
                {
                    "name": "parameter name",
                    "type": "parameter type"
                }
            ]
        }
    ]
}
```
