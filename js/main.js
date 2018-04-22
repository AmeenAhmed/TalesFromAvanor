(function () {
    $(function () {
        window.avanor = {};

        avanor.leftPage = {
            content: $('.left-page .page-content'),
            button: $('.left-page .page-button')
        };

        avanor.rightPage = {
            content: $('.right-page .page-content')
        };

        avanor.leftPage.button.on ('click', function () {
            avanor.game.nextTurn ();
        });

        avanor.ui = {};

        Object.defineProperty (avanor.leftPage, 'title', {
            get: function () {
                return $('.left-page .page-title').text ();
            },
            set: function (val) {
                $('.left-page .page-title').text (val);
            }
        });

        Object.defineProperty (avanor.rightPage, 'title', {
            get: function () {
                return $('.right-page .page-title').text ();
            },
            set: function (val) {
                $('.right-page .page-title').text (val);
            }
        });

        avanor.ui.renderView = function (key, node, props) {
            var template = $('script#' + key).text ();
            
            if (template) {
                exec = _.template (template);
                var html = exec (props);
                node.empty ();
                var child = $(html);
                node.append (child);
                return child;
            } else {
                throw new Error ('View not found!');
            }
        };

        avanor.ui.showMainMenu = function (node) {
            avanor.ui.renderView ('main-menu-view', node);
        }

        avanor.ui.showBottomButton = function (page) {

        }

        avanor.showMenu = function () {
            // avanor.leftPage.title = 'Menu';
            // avanor.ui.showMainMenu (avanor.leftPage.content);
            avanor.createNewGame ();
            $('body').on ('click.once', function () {
                $('.book-closed').hide ();
                $('.intro-modal').show ();
                $('body').off ('click.once');
            });
        }

        avanor.ui.showOptions = function (page, title, options) {
            page.title = title;
            page.content.empty ();
            var ul = $('<ul class="options-list"/>');
            page.content.append (ul);
            for (var i=0; i<options.length; i++) {
                var li = $('<li/>');
                ul.append (li);
                li.text (options [i].text);

                if (options [i].disabled) {
                    li.addClass ('disabled');

                    li.append ($('<span class="disabled-text"/>').text (options [i].disabledText));
                }
                
                
                !function (node, idx) {
                    node.on ('click', function () {
                        options [idx].cb ();
                    });
                } (li, i);
            }
        };

        avanor.ui.showMessage = function (page, text) {
            // page.content.empty ();
            page.content.find ('.messages .msg').removeClass ('new');
            page.content.find ('.messages').append ($('<div class="msg"/>').addClass ('new').html (text));
            page.content.find ('.messages').animate ({
                scrollTop: page.content.find ('.messages').scrollTop () + 200
            });
        }

        avanor.showNewGame = function () {
            avanor.leftPage.title = 'New Game';
            avanor.ui.renderView ('new-game-view', avanor.leftPage.content);
        }

        avanor.clearPages = function () {
            avanor.leftPage.title = '';
            avanor.rightPage.title = '';
            avanor.leftPage.content.empty ();
            avanor.rightPage.content.empty ();
        }

        avanor.createNewGame = function () {
            avanor.game = new Game ({
                kingName: $('#new-game-name').val (),
                kingdom: $('#new-game-kingdom .checked .label').text (),
            });

            avanor.game.newGameSetup ();

            localStorage.setItem ('Avanor', JSON.stringify (avanor.game.serialize ()));
        }

        $('body').on ('click', '#new-game', function () {
            avanor.clearPages ();
            avanor.showNewGame ();
        });

        $('body').on ('click', '.option-group .option', function (ev) {
            $(this).parent ().find ('.option').removeClass ('checked');
            $(this).addClass ('checked');
        });

        $('body').on ('click', '.option-group#new-game-kingdom .option', function (ev) {
            if ($('#new-game-kingdom .checked').length && $('#new-game-name').val ()) {
                $('#new-game-btn').addClass ('active');
            } else {
                $('#new-game-btn').removeClass ('active');
            }
        });

        $('body').on ('change', '#new-game-name', function (ev) {
            if ($('#new-game-kingdom .checked').length && $('#new-game-name').val ()) {
                $('#new-game-btn').addClass ('active');
            } else {
                $('#new-game-btn').removeClass ('active');
            }
        });

        $('body').on ('keyup', '#new-game-name', function (ev) {
            if ($('#new-game-kingdom .checked').length && $('#new-game-name').val ()) {
                $('#new-game-btn').addClass ('active');
            } else {
                $('#new-game-btn').removeClass ('active');
            }
        });

        $('body').on ('click', '#new-game-btn.active', function () {
            avanor.createNewGame ();
        });

        $('body').on ('click', '.move-to-garrison', function () {
            var unit = $(this).attr ('data-key');
            if (avanor.game.props.army [unit] > 0) {
                avanor.game.props.army [unit] --;
                avanor.game.props.garrison [unit] ++;
                avanor.ui.renderView ('garrison-view', avanor.leftPage.content);
            }
        });

        $('body').on ('click', '.move-to-army', function () {
            var unit = $(this).attr ('data-key');
            if (avanor.game.props.garrison [unit]) {
                avanor.game.props.army [unit] ++;
                avanor.game.props.garrison [unit] --;
                avanor.ui.renderView ('garrison-view', avanor.leftPage.content);
            }
        });

        $('body').on ('click', '.inventory-view-back', function () {
            avanor.game.props.cities [0].showDialog ('Chancellor');
        });

        $('body').on ('click', '.garrison-back', function () {
            avanor.game.props.cities [0].showDialog ('Marshall');
        });

        $('body').on ('click', '.research-view-back', function () {
            avanor.game.props.cities [0].showDialog ('Chaplain');
        });

        $('body').on ('click', '.research-btn', function () {
            var key = $(this).attr ('data-key');
            
            avanor.game.startResearch (key);
            avanor.game.props.cities [0].showDialog ('Chaplain');
        });

        $('body').on ('click', '.lets-go', function () {
            $('.book').show ();
            $('.intro-modal').hide ();
        });

        

        

        // try {
        //     var data = JSON.parse (localStorage.getItem ('Avanor'));
        //     if (data) {
        //         avanor.game = new Game ();
        //         avanor.game.deserialize (data);
        //     }
        // } catch (e) {
        //     throw e;
        // }
        

        if (!avanor.game) {
            avanor.showMenu ();
        }
    });
}) ();