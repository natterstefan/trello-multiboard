require.config({

    paths: {
        "app": "js/app.min",
        "bootstrap": "js/bootstrap.min",
        "jquery": ["//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min"]
    }
});

require(["jquery", "app" ], function($) {

    var version = "0.1.0";
    var app = "";
    var config = [];
    var urlArray = window.location.pathname.split( '/' );

    /* load bootstrap */
    require(["bootstrap"]);

    /* add version */
    $('#version').text('(v' + version +')');

    $.getJSON( "app.json", function( data ) {

        $.each( data, function( key, val ) {
            config[key] = val;
        });
        config.url = urlArray;

        $.getScript( "https://api.trello.com/1/client.js?key=" + config["key"]).success(function() {

            app = new App(config);
            app.init();
        });

        /* init clipboard feature */
        var clipboard = new Clipboard('#trello-id');

    })
    .fail(function(responseText) {
        console.error( responseText );
    });

    /* buttons & dropdowns*/
    $( ".btn-refresh" ).bind( "click", function() {

        $(".trello-ready").html("");
        $(".trello-working").html("");
        $(".trello-done").html("");

        app.board = ( $( ".drop-boards option:selected").attr("value") == 0) ? "" : $( ".drop-boards option:selected").attr("value");
        app.member = ( $( ".drop-member option:selected").attr("value") == 0) ? "" : $( ".drop-member option:selected").attr("value");
        app.loadBoards();

    });
    $( ".btn-showall" ).bind( "click", function() {

        $(".trello-ready").html("");
        $(".trello-working").html("");
        $(".trello-done").html("");

        app.board = "";
        app.member = "";
        app.loadBoards();

    });
    $( ".drop-member" ).bind( "change", function() {

        $(".trello-ready").html("");
        $(".trello-working").html("");
        $(".trello-done").html("");

        if(this.value == 0) {

            app.member = "";
            app.loadBoards();

        } else {

            app.board = $( ".drop-boards option:selected").attr("value");
            app.member = this.value;
            app.loadBoards();
        }

    });
    $( ".drop-boards" ).bind( "change", function() {

        $(".trello-ready").html("");
        $(".trello-working").html("");
        $(".trello-done").html("");

        if(this.value == 0) {

            app.board = "";
            app.member = "";
            app.loadBoards();

        } else {

            app.board = this.value;
            app.member = "";
            app.loadBoards();
        }

    });

    /* helper */
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });
    $('.scrollup').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });
});
