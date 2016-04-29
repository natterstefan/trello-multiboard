# TRELLO-MULTIBOARD (v0.1.0)#

Trello-Multiboard App to display several lists (up to three) from different boards. You can either display an entire project or one member only.


### INSTALLATION ###

* clone repo: https://github.com/natterstefan/trello-multiboard.git
* checkout `develop` or `master` branch
* run `npm install`
* replace `XX` with your Trello-API Key (https://trello.com/app-key) in the `app.json` file
* run `grunt pub`
* (currently, must be fixed in the future) modify the `/dist/index.html` and modify the `href` of the `<base>` tag
* start local server and open `/dist`folder
* start developing


### DEVELOP ###

Start Grunt Watch with

`grunt watch`

Create new version and update `dist` with

`grunt pub`


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
