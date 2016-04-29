/* CHECKLIST */
var CheckItem = function(obj, parent){
    this.checkItem = obj;
    this.parent = parent;
    var card = this.parent.parent;
    var node = $('<li></li>').text(this.checkItem.name);

    if (this.checkItem.state == "complete"){
        //console.log("append ", node, card.view);
        $('.tasks-complete', card.view).append(node);
        this.parent.state.completed++;
    }
    else{
        //console.log("append ", node, card.view);
        $('.tasks-incomplete', card.view).append(node);
    }

    this.parent.state.total++;
};

var CheckList = function(obj, parent){
    this.checkList = obj;
    this.parent = parent;
    this.checkItems = [];
    this.state = { 'completed': 0, 'total': 0 };

    //console.log("CheckList Initialized", this.checkList.name);
    this.loadCheckItems();
};
CheckList.prototype.loadCheckItems = function(){
    var ptr = this;
    Trello.get('/checklists/'+this.checkList.id,
        function(result){
            for (var i=0; i<result.checkItems.length;i++){
                ptr.addCheckItem(result.checkItems[i]);
            }

            var node = $('<strong></strong>').text(result.name + " (" + ptr.state.completed + "/" + ptr.state.total + ")");
            $(".tasks-header", ptr.parent.view).append(node);
        },
        function(errorMsg){
            console.log("error loading cards", errorMsg);
        });
};
CheckList.prototype.addCheckItem = function(obj){
    //console.log("addCheckItem", obj);
    this.checkItems.push(new CheckItem(obj, this));
};

/* CARD */
var Card = function(obj, parent) {
    this.card = obj;
    this.parent = parent; //list
    this.checkLists = [];

    this.view = $("#template-card").clone();
    this.view.attr("id", "card-" + this.card.id);
    console.log("card", this);

    var title = this.card.name.replace('#' + this.card.idShort, '').trim();
    $(".card-title-link", this.view).text(title);
    $(".card-title-link", this.view).attr('href', this.card.url);
    $('.card-project', this.view).text(this.parent.parent.board.name);
    $('.card-number', this.view).text('#' + this.card.idShort);

    /* add member img to the card */
    for (var member in this.card.members) {
        $('.card-members', this.view).append('<a href="'+this.card.members[member].url +'" target="_blank"><img src="https://trello-avatars.s3.amazonaws.com/'+ this.card.members[member].avatarHash +'/50.png" alt="'+ this.card.members[member].username +'" /></a>');
    }

    /* add colors */
    if( this.parent.parent.config.background_color != "" || typeof this.parent.parent.config.background_color != "undefined" ) {
        $(this.view).css('background-color', this.parent.parent.config.background_color );
        $(this.view).css('background-image', 'none');
    }
    if( this.parent.parent.config.color != "" || typeof this.parent.parent.config.color != "undefined" ) {
        $(this.view).css('color', this.parent.parent.config.color );
    }

    this.loadCheckLists();
};

Card.prototype.loadCheckLists = function(){

    if (this.card.idChecklists.length == 0){
        return;
    }

    var ptr = this;

    Trello.get('/cards/'+this.card.id+'/checklists', // able to avoid?
        function(result){
            for (var i=0; i<result.length;i++){

                if ( result[i].name.match( ptr.parent.parent.config.checklists ) ){
                    ptr.addCheckList(result[i]);
                }
            }
        },
        function(errorMsg){
            console.log("error loading cards", errorMsg);
        });
};
Card.prototype.addCheckList = function(obj){
    //console.log("Card.addCheckList", obj);
    this.checkLists.push(new CheckList(obj, this));
};
Card.prototype.render = function(target){
    $(target).append(this.view);
};

/* LIST */
var List = function(obj, parent){
    this.list = obj;
    this.parent = parent; // board
    this.cards = [];
    this.loadCards();
};

List.prototype.loadCards = function(){
    var ptr = this;
    Trello.get('/lists/'+this.list.id+'/cards?members=true&member_fields=avatarHash,username,url',
        function(result){

            for (var i=0; i<result.length;i++){

                /** check if member is on the card **/
                if(ptr.parent.parent.member != "" ){

                    for (var z = 0; z < result[i].idMembers.length; z++) {

                        if ( result[i].idMembers[z] == ptr.parent.parent.member ) {
                            ptr.addCard(result[i]);
                        }
                    }
                } else {
                    ptr.addCard(result[i]);
                }
            }
        },
        function(errorMsg){
            console.log("error loading cards", errorMsg);
        });
};
List.prototype.addCard = function(obj){

    var card = new Card(obj, this);
    this.cards.push(card);

    var target = '.target-'+this.getColumn();
    card.render(target);
};
List.prototype.getColumn = function(){

    if ( this.list.name.match(this.parent.config.label_ready) ){
        return 'ready';
    }
    else if ( this.list.name.match(this.parent.config.label_working) ){
        return 'working';
    }
    else if ( this.list.name.match(this.parent.config.label_done) ){
        return 'done';
    }
    console.warn('List.getColumn warning. unexpected Column', this.list);
};

/* BOARD */
var Board = function(obj, config, parent){
    this.board = obj;
    this.config = config;
    this.parent = parent; // app
    this.lists = [];

    this.loadBoardMembers();
    this.loadLists();
};

Board.prototype.loadBoardMembers = function(){

    var ptr = this;
    var members = []; // board members
    ptr.parent.members = []; // app members

    Trello.get("boards/" + this.board['id'] + "/members", function(data) {})

        .success( function(data) {

            $.each(data, function (ix, item) {
                if (members.indexOf(item.username) == -1) {
                    members[item.id] = item.username;
                }
            });

            /* sort & add members */
            members = ptr.sortMembers(members);
            ptr.board["members"] = members;
            for (key in members) {
                ptr.parent.members[key] = members[key];
            }
            ptr.parent.members = ptr.sortMembers(ptr.parent.members);

            /* display members of all/single board */
            $(".drop-member").html("");
            $(".drop-member").append("<option value=\"0\">-</option>");

            for (key in ptr.parent.members) {

                if ( (key == ptr.parent.member) || ptr.parent.members[key] == ptr.parent.member ) {
                    $(".drop-member").append("<option value=\"" + key + "\" selected=\"selected\">" + ptr.parent.members[key], + "</option>");
                } else {
                    $(".drop-member").append("<option value=\"" + key + "\">" + ptr.parent.members[key], +"</option>");
                }
            }

        });
};
Board.prototype.sortMembers = function(members) {

    var arraySort = [];

    for (var key in members) arraySort.push( [members[key], key] );

    arraySort.sort(function(a, b) {
        a = a[0];
        b = b[0];
        return a < b ? -1 : (a > b ? 1 : 0);
    });

    members = [];

    for (var i = 0; i < arraySort.length; i++) {
        members[arraySort[i][1]] = arraySort[i][0];
    }

    return members;

};
Board.prototype.loadLists = function(){
    var ptr = this;

    Trello.get('/boards/'+this.board.id+ '/lists',
        function(result){
            console.log("board with lists found", result.length, this);
            for (var i=0; i<result.length; i++){

                if (result[i]['name'].match(ptr.config['label_ready']) ||
                    result[i]['name'].match(ptr.config['label_working']) ||
                    result[i]['name'].match(ptr.config['label_done'])){

                    ptr.addList(result[i]);
                }
            }
        },
        function(errorMsg){
            console.log("error loading lists", errorMsg);
        });
};
Board.prototype.addList = function(obj){
    this.lists.push(new List(obj, this));
};

/* APP */
var App = function(config){

    /* 'config' structure
     * key
     * projects
     * name
     * label_ready, label_working, label_done
     * checklists
     */

    this.config = config;
    this.boards = []; // all boards
    this.board = ""; // single board
    this.members = []; // all users
    this.member = ""; // single user
    this.userId = ""; // logged in user

    console.info("Config: ", this.config);
    console.info("App: ", this);

};

App.prototype.init = function() {

    this.authorize();
    this.getLoggedInUser();
    this.getSelectedUser();
    this.loadBoards();

};
App.prototype.authorize = function(){
    Trello.authorize({
        type: "redirect",
        name: "multiboard-for-trello",
        scope: {
            read: true,
            write: false },
        expiration: "never"
    });
};
App.prototype.getLoggedInUser = function(){

    var ptr = this;

    Trello.members.get("me", function(result){})

        .success(function(result) {
            $("#trello-name").html(result.username + '<span class="caret"></span>');
            $("#trello-link").attr('href', result.url);
            $("#trello-id").html(result.id).attr('data-clipboard-text', result.id);

            var bases = document.getElementsByTagName('base');
            if (bases.length > 0) {
                $("#trello-bookmark").attr('href', bases[0].href + "member/" + result.username);
            }

            ptr.userId = result.id;
    });

};
App.prototype.loadBoards = function() {
    var ptr = this;

    if ( (ptr.member == "" || ptr.member == 0) && (ptr.board == 0 && ptr.board == "")) {
        /* default - member and board empty */
        Trello.get('/member/me/boards',
            function (result) {

                ptr.checkBoards(result);

            },
            function (errorMsg) {
                console.log("error", errorMsg);
            });


    } else if ( (ptr.member != "" || ptr.member != 0) && (ptr.board == 0 || ptr.board == "")) {
        /* member set, board empty */
        Trello.get('/member/' + ptr.member + '/boards',
            function (result) {

                ptr.checkBoards(result);
            },
            function (errorMsg) {
                console.log("error", errorMsg);
            });

    } else if ( (ptr.member == "" || ptr.member == 0) && (ptr.board != 0 || ptr.board != "") ) {
        /* member empty, board set */
        Trello.get('/boards/' + ptr.board,
            function (result) {

                ptr.checkBoard(result);

            },
            function (errorMsg) {
                console.log("error", errorMsg);
            });


    } else {
        /* member set, board set */
        Trello.get('/boards/' + ptr.board,
            function (result) {

                ptr.checkBoard(result);

            },
            function (errorMsg) {
                console.log("error", errorMsg);
            });

    }

};
App.prototype.addBoard = function(obj, config){

    var board = new Board(obj, config, this);
    this.boards.push(board);

    /* add to dropdown */
    if($(".drop-boards option[value='0']").length <= 0 ) {
        $(".drop-boards").append("<option value=\"0\">-</option>");
    }

    if($(".drop-boards option[value='"+ obj.id +"']").length <= 0 ) {
        $(".drop-boards").append("<option value=\""+ obj.id +"\">" + obj.name + "</option>");
    }

};
App.prototype.checkBoard = function(result) {

    var ptr = this;
    var board = result;

    for (var property in ptr.config.boards) {

        if (ptr.config.boards.hasOwnProperty(property)) {

            if ( board['name'].match(ptr.config.boards[property].name) ) {

                console.log("add board ", board['name']);
                ptr.addBoard(board, ptr.config.boards[property] );
            }
        }
    }
};
App.prototype.checkBoards = function(result) {

    var ptr = this;
    var boolBoard = false;

    for (var i = 0; i < result.length; i++) {
        var board = result[i];

        for (var property in ptr.config.boards) {

            if (ptr.config.boards.hasOwnProperty(property)) {

                /* reset value */
                boolBoard = false;
                if ( board['name'].match(ptr.config.boards[property].name) ) {

                    /* if no member_config present */
                    if (typeof ptr.config.membersConfig != "undefined") {

                        /* if member_config present; check if current user has a rule */
                        if ( board['name'].match(ptr.config.membersConfig[ptr.userId] ) &&
                            typeof ptr.config.membersConfig[ptr.userId] != "undefined" ) {
                            boolBoard = false;
                        } else {
                            boolBoard = true;
                        }

                    } else {
                            boolBoard = true;
                    }

                    /* add board */
                    if(boolBoard) {
                        console.log("add board ", board['name']);
                        ptr.addBoard(board, ptr.config.boards[property]);
                    }
                } // if board match
            }
        }
    }
};
App.prototype.getSelectedUser = function() {

    var ptr = this;
    for(var i = 0; i < ptr.config.url.length; i++) {

        if(ptr.config.url[i] == 'member') {

            $(".drop-member option").filter(function() {
                return $(this).text() == ptr.config.url[i+1];
            }).prop('selected', true);

            Trello.members.get(ptr.config.url[i+1], function(result){})

                .success(function(result) {

                    ptr.member = result.id;
                    $('#member-name').text( result.username );
                });
        }
    }
};