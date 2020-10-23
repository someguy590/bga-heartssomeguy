/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * TutorialSomeGuy implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * tutorialsomeguy.js
 *
 * TutorialSomeGuy user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

define([
    "dojo", "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock"
],
    function (dojo, declare) {
        return declare("bgagame.tutorialsomeguy", ebg.core.gamegui, {
            constructor: function () {
                console.log('tutorialsomeguy constructor');

                // Here, you can init the global variables of your user interface
                // Example:
                // this.myGlobalValue = 0;
                this.cardWidth = 72;
                this.cardHeight = 96;

            },

            /*
                setup:
                
                This method must set up the game user interface according to current game situation specified
                in parameters.
                
                The method is called each time the game interface is displayed to a player, ie:
                _ when the game starts
                _ when a player refreshes the game page (F5)
                
                "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
            */

            setup: function (gamedatas) {
                console.log("Starting game setup");

                // Setting up player boards
                for (var player_id in gamedatas.players) {
                    var player = gamedatas.players[player_id];

                    // TODO: Setting up players boards if needed
                }

                // TODO: Set up your game interface here, according to "gamedatas"
                // player hand
                this.playerHand = new ebg.stock();
                this.playerHand.create(this, $('myhand'), this.cardWidth, this.cardHeight);
                this.playerHand.image_items_per_row = 13;

                // create cards types
                for (let color = 0; color < 4; color++) {
                    for (let value = 2; value <= 14; value++) {
                        // build card type id
                        let cardTypeId = this.getCardUniqueId(color, value);
                        this.playerHand.addItemType(cardTypeId, cardTypeId, g_gamethemeurl + 'img/cards.jpg', cardTypeId);
                    }
                }

                dojo.connect(this.playerHand, 'onChangeSelection', this, 'onPlayerHandSelectionChanged');

                // cards in player hand
                for (let [id, card] of Object.entries(gamedatas.hand)) {
                    let { type: color, type_arg: value } = card;
                    this.playerHand.addToStockWithId(this.getCardUniqueId(color, value), card.id);
                }

                // cards on table
                for (let card of this.gamedatas.cardsOnTable) {
                    let { type: color, type_arg: value, location_arg: player_id } = card;
                    this.playCardOnTable(player_id, color, value, card.id);
                }

                // Setup game notifications to handle (see "setupNotifications" method below)
                this.setupNotifications();

                console.log("Ending game setup");
            },


            ///////////////////////////////////////////////////
            //// Game & client states

            // onEnteringState: this method is called each time we are entering into a new game state.
            //                  You can use this method to perform some user interface changes at this moment.
            //
            onEnteringState: function (stateName, args) {
                console.log('Entering state: ' + stateName);

                switch (stateName) {

                    /* Example:
                    
                    case 'myGameState':
                    
                        // Show some HTML block at this game state
                        dojo.style( 'my_html_block_id', 'display', 'block' );
                        
                        break;
                   */


                    case 'dummmy':
                        break;
                }
            },

            // onLeavingState: this method is called each time we are leaving a game state.
            //                 You can use this method to perform some user interface changes at this moment.
            //
            onLeavingState: function (stateName) {
                console.log('Leaving state: ' + stateName);

                switch (stateName) {

                    /* Example:
                    
                    case 'myGameState':
                    
                        // Hide the HTML block we are displaying only during this game state
                        dojo.style( 'my_html_block_id', 'display', 'none' );
                        
                        break;
                   */


                    case 'dummmy':
                        break;
                }
            },

            // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
            //                        action status bar (ie: the HTML links in the status bar).
            //        
            onUpdateActionButtons: function (stateName, args) {
                console.log('onUpdateActionButtons: ' + stateName);

                if (this.isCurrentPlayerActive()) {
                    switch (stateName) {
                        /*               
                                         Example:
                         
                                         case 'myGameState':
                                            
                                            // Add 3 action buttons in the action status bar:
                                            
                                            this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' ); 
                                            this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' ); 
                                            this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' ); 
                                            break;
                        */
                    }
                }
            },

            ///////////////////////////////////////////////////
            //// Utility methods

            /*
            
                Here, you can defines some utility methods that you can use everywhere in your javascript
                script.
            
            */
            // get card unique identifier based on its color and value
            getCardUniqueId: function (color, value) {
                return (color * 13) + (value - 2);
            },

            playCardOnTable: function (playerId, color, value, cardId) {
                dojo.place(this.format_block('jstpl_cardontable', {
                    x: this.cardWidth * (value - 2),
                    y: this.cardheight * color,
                    player_id: playerId
                }), 'playertablecard_' + playerId);

                if (playerId != this.player_id) {
                    this.placeOnObject(`cardontable_${playerId}`, `overall_player_board_${playerId}`);
                }
                else {
                    if ($(`myhand_item_${cardId}`)) {
                        this.placeOnObject(`cardontable_${playerId}`, `myhand_item_${cardId}`);
                        this.playerHand.removeFromStockById(cardId);
                    }
                }

                this.slideToObject(`cardontable_${playerId}`, `playertablecard_${playerId}`).play();
            },


            ///////////////////////////////////////////////////
            //// Player's action

            /*
            
                Here, you are defining methods to handle player's action (ex: results of mouse click on 
                game objects).
                
                Most of the time, these methods:
                _ check the action is possible at this game state.
                _ make a call to the game server
            
            */

            onPlayerHandSelectionChanged: function () {
                let items = this.playerHand.getSelectedItems();

                if (items.length > 0) {
                    let action = 'playCard';
                    if (this.checkAction(action, true)) {
                        let cardId = items[0].id;
                        this.ajaxcall(
                            `/${this.game_name}/${this.game_name}/${action}.html`,
                            {
                                id: cardId,
                                lock: true
                            }, this, function (result) { }, function (is_error) { }
                        );

                        this.playerHand.unselectAll();
                    }
                    else if (this.checkAction('giveCards')) {

                    }
                    else {
                        this.playerHand.unselectAll();
                    }
                }
            },

            /* Example:
            
            onMyMethodToCall1: function( evt )
            {
                console.log( 'onMyMethodToCall1' );
                
                // Preventing default browser reaction
                dojo.stopEvent( evt );
    
                // Check that this action is possible (see "possibleactions" in states.inc.php)
                if( ! this.checkAction( 'myAction' ) )
                {   return; }
    
                this.ajaxcall( "/tutorialsomeguy/tutorialsomeguy/myAction.html", { 
                                                                        lock: true, 
                                                                        myArgument1: arg1, 
                                                                        myArgument2: arg2,
                                                                        ...
                                                                     }, 
                             this, function( result ) {
                                
                                // What to do after the server call if it succeeded
                                // (most of the time: nothing)
                                
                             }, function( is_error) {
    
                                // What to do after the server call in anyway (success or failure)
                                // (most of the time: nothing)
    
                             } );        
            },        
            
            */


            ///////////////////////////////////////////////////
            //// Reaction to cometD notifications

            /*
                setupNotifications:
                
                In this method, you associate each of your game notifications with your local method to handle it.
                
                Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                      your tutorialsomeguy.game.php file.
            
            */
            setupNotifications: function () {
                console.log('notifications subscriptions setup');

                // TODO: here, associate your game notifications with local methods
                dojo.subscribe('newHand', this, 'notif_newHand');
                dojo.subscribe('playCard', this, 'notif_playCard');
                dojo.subscribe('trickWin', this, 'notif_trickWin');
                this.notifqueue.setSynchronous('trickWin', 1000);
                dojo.subscribe('giveAllCardsToPlayer', this, 'notif_giveAllCardsToPlayer');
                dojo.subscribe('newScores', this, 'notif_newScores');
                // Example 1: standard notification handling
                // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );

                // Example 2: standard notification handling + tell the user interface to wait
                //            during 3 seconds after calling the method in order to let the players
                //            see what is happening in the game.
                // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
                // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
                // 
            },

            // TODO: from this point and below, you can write your game notifications handling methods
            notif_newHand: function (notif) {
                this.playerHand.removeAll();

                for (let card of Object.values(notif.args.cards)) {
                    let { type: color, type_arg: value } = card;
                    this.playerHand.addToStockWithId(this.getCardUniqueId(color, value), card.id);
                }
            },

            notif_playCard: function (notif) {
                // play card on table
                this.playCardOnTable(notif.args.player_id, notif.args.color, notif.args.value, notif.args.card_id);
            },

            notif_trickWin: function (notif) {

            },

            notif_giveAllCardsToPlayer: function (notif) {
                // move cards from table to player, then destroy
                let winnerId = notif.args.player_id;
                for (let playerId of Object.keys(this.gamedatas.players)) {
                    let anim = this.slideToObject(`cardontable_${playerId}`, `overall_player_board_${winnerId}`);
                    dojo.connect(anim, 'onEnd', function (node) {
                        dojo.destroy(node);
                    });
                    anim.play();
                }
            },

            notif_newScores: function (notif) {
                for (const {player_id, player_score} of notif.args.newScores) {
                    this.scoreCtrl[player_id].toValue(player_score);
                }
            }
            /*
            Example:
            
            notif_cardPlayed: function( notif )
            {
                console.log( 'notif_cardPlayed' );
                console.log( notif );
                
                // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
                
                // TODO: play the card in the user interface.
            },    
            
            */
        });
    });
