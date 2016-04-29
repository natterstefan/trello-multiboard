# TRELLO-MULTIBOARD (v0.1.0)#

Trello-Multiboard App to display several lists (up to three) from different boards. You can either display an entire project or one member only.


### INSTALLATION ###

* clone git: https://github.com/natterstefan/trello-multiboard.git
* checkout `develop` or `master` branch
* run `npm install`
* duplicate and rename `app.json.sample` to `app.json`
* replace `XX` with your Trello-API Key (https://trello.com/app-key) in the `app.json` file
* setup the config file to load at least one of your boards, so you can test it. See the example below.
* run `grunt pub`
* open `/dist` folder in your browser
* you should now see your card of the configured board


### DEVELOP ###

Start Grunt Watch with

`grunt watch`

Create new version and update `dist` with

`grunt build`


### CONFIGURATION ###

1) add a "app.json" file with the following configuration to the root folder of the project.

2) Note: color and background color are optional, as well as "membersConfig".

3) change the base-tag in the index.html to get the css working (note: add "/" at the end)

4) modify .htaccess (apache) if needed


### Example app.json config ###

```
#!json

{
  "key": "<your_trello_app_key>",
  "boards" : {
    "ls_boards" : {
        "name": "^ls-",
        "label_ready": "(R|r)eady",
        "label_working": "(W|w)orking",
        "label_done": "(D|d)one",
        "checklists": "^(ACS|acs|ACs)$",
        "color": "#fff",
        "background_color": "#000"
    }
  },
    "membersConfig": {
        "<user_id>" : "^ls-r"
    }
}
```


### ADDITIONAL NOTES  ###

* Releases are published here: [https://github.com/natterstefan/trello-multiboard.git](https://github.com/natterstefan/trello-multiboard.git)


### AUTHOR & CONTRIBUTORS ###

* Author: Stefan Natter
* Inspired by: Manfred Schwendinger
