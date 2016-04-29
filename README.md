# TRELLO-MULTIBOARD (v0.1.0)#

The Trello-Multiboard displays several lists (currently: up to three) from different boards. The current features are:

* display all boards and lists of all members
* display only one board and all its members
* display only one board and one member inside the board
* display all boards of one member


### INSTALLATION ###

* clone git: `git clone https://github.com/natterstefan/trello-multiboard.git`
* checkout `git checkout develop` or `git checkout master` branch
* pull the latest updates `git pull`
* run `npm install`
* duplicate and rename `app.json.sample` to `app.json`
* replace `XX` with your Trello-API Key (https://trello.com/app-key) in the `app.json` file
* setup the config file to load at least one of your boards, so you can test it. See the example below.
* move `app.json` into `/app`
* run `grunt run`
* open `http://127.0.0.1:8282/` in your browser
* you should now see the cards of the configured board


### DEVELOP ###

Start Grunt Watch with

`grunt watch`

Create new version and update `dist` with

`grunt build`


### CONFIGURATION ###

* you can add as many `boards` as you like. Currently the `name` of the board (in this case `ls_boards`) is not used in the code somewhere else (e.g. filter or something)
* `name` and the other properties work with RegEx
* `membersConfig` is optional and can hide specific boards if a certain user is logged in.
* `color` and `background_color` are optional


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


### AUTHOR & CONTRIBUTORS ###

* Author: Stefan Natter
* Inspired by: Manfred Schwendinger
