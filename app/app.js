window.nbLines = 10;
window.nbColumns = 13;

// AngularJS code
require('angular');

var app = angular.module('app', []);

app.controller('MainController', function($scope) {

    $scope.title = 'Angular Battle';
    $scope.nbLines = window.nbLines;
    $scope.nbColumns = window.nbColumns;
    $scope.arr = [];
    $scope.engine = new Engine();
    $scope.selectedCard = null;
    $scope.alert = '';

    /**
     * Initialize the Grid
     */
    $scope.grid = function() {
        var total = $scope.nbColumns * $scope.nbLines;

        for(var i = 0 ; i < total ; i++) {
            $scope.arr[i] = i;
        }

        // Discover first case for enemy
        $scope.engine.board.discover(6, 0, true);

        // Discover first case for player
        $scope.engine.board.discover(6, ( window.nbLines - 1 ));

        // Set engine globally accessible
        window.engine = $scope.engine;

        // TODO remove // Add cards for testing phase
        $scope.engine.ennemy.hand = [];
        var caval = new Champion('Chevalier'); caval.pv = 12;
        $scope.engine.ennemy.hand.push( caval );
        var shityTank = new Champion('Tank'); shityTank.pv = 10;
        $scope.engine.ennemy.hand.push( shityTank );
        var mage = new Champion('Mage'); mage.pv = 35;
        $scope.engine.ennemy.hand.push( mage );
        //$scope.engine.ennemy.hand.push( new Monster('Dragon') );
        //$scope.engine.ennemy.hand.push( new Move(2) );
        //$scope.engine.ennemy.hand.push( new Item("Boost") );
        $scope.engine.ennemy.hand.push( new Item("Potion") );
        $scope.engine.ennemy.hand.push( new Item("Grande Potion") );

        // TODO remove // Add Traps to test behaviour
        var ennemyTrap = new Trap('Simple');    ennemyTrap.isEnemy = true;
        $scope.engine.board.getCase(6, window.nbLines - 2).discover();
        $scope.engine.board.getCase(6, window.nbLines - 2).contains = ennemyTrap;
        var playerTrap = new Trap('Simple');
        $scope.engine.board.getCase(7, window.nbLines - 1).discover();
        $scope.engine.board.getCase(7, window.nbLines - 1).contains = playerTrap;
        $scope.engine.player.hand.push( new Champion('Mage') );
        $scope.engine.player.hand.push( new Move(1) );

        // TODO remove // Make player castle selectable
        $scope.engine.board.playerCastle.addClass('selectable');
    };

    /**
     * When player select a card from its hand
     * @param card
     */
    $scope.selectCard = function(card) {
        $scope.selectedCard = card;
    };

    /**
     * When player draws
     */
    $scope.draw = function() {
        if ( $scope.engine.turn.player && $scope.engine.turn.step == 0 ) {
            $scope.engine.player.draw();
            $scope.engine.log("Le joueur a pioché.");
            $scope.engine.incrementStep();
        } else {
            $scope.setAlert('Vous ne pouvez pas piocher pour l\'instant !');
        }
    };

    /**
     * Trash a card from hand (when played or trashed)
     * @param muteLog
     */
    $scope.trash = function(muteLog) {
        if ( $scope.engine.turn.player && $scope.engine.turn.step == 4 ) {
            $scope.engine.trashCard($scope.selectedCard);
            if ( !muteLog ) {
                $scope.engine.log("Le joueur a défaussé : "+ $scope.selectedCard.getDisplayName() +".");
            }
            $scope.selectedCard = null;
        } else {
            $scope.setAlert('Vous ne pouvez pas effectuer cette action pour l\'instant !');
        }
    };

    /**
     * Play a card from hand, then trash it
     */
    $scope.play = function() {
        if ( $scope.engine.turn.player && $scope.engine.turn.step == 4 ) {
            $scope.engine.playCard( $scope.selectedCard );
            $scope.trash(true);
        } else {
            $scope.setAlert('Vous ne pouvez pas effectuer cette action pour l\'instant !');
        }
    };

    /**
     * When player ends its turn
     */
    $scope.end = function() {
        if ( $scope.engine.turn.player && $scope.engine.turn.step == 4 ) {
            $scope.engine.endTurn();
        } else {
            $scope.setAlert('Vous ne pouvez pas effectuer cette action pour l\'instant !');
        }
    };

    /**
     * Action to do when player click on a selectable case on the grid
     * @param _case
     */
    $scope.selectCase = function(_case) {
        if ( _case.isSelectable ) {
            if ( $scope.engine.attackingElement ) {
                $scope.engine.attackEnemy(_case);
            }
            else if ( $scope.engine.movingChampionCase ) {
                $scope.engine.moveChampion(_case);
            }
            else if ( $scope.engine.playingCard.isPosable() ) {
                $scope.engine.invoke(_case);
            }
            else if ( $scope.engine.playingCard.isUsable() ) {
                $scope.engine.activateCardEffect(_case);
            }
        }
    };

    /**
     * Set the alert message
     * @param message
     */
    $scope.setAlert = function(message) {
        $scope.alert = message;
    };

    /**
     * Determines if the selected card from hand is playable
     * @returns {*|boolean}
     */
    $scope.canPlay = function() {
        return $scope.engine.canPlay( $scope.selectedCard );
    };

});

// jQuery code
$(function() {
    $('.grid .cell').mouseenter(function() {
        var data = $(this).attr('data-hover');

        // TODO remove
        if ( !data )   data = $(this).attr('data-case');

        if ( data ) {
            data = JSON.parse(data);

            var title = data.type;
            var content = "";

            if ( data.type == "Piège" ) {
                title += " " + data.name;
                content += "<img class='turnsLeft-icon' src='img/hourglass.png'> "+ data.turnsLeft +"<br>";
            }
            if ( data.type == "Champion" || data.type == "Monstre" ) {
                title += " " + data.name;
                content += "<img class='pv-icon' src='img/heart.png'> "+ data.pv + " / " + data.maxPv + "<br>";
                content += "<img class='atk-icon' src='img/sword.png'> "+ data.atk +"<br>";
            }
            if ( data.type == "Château" || data.type == "Château Ennemi" ) {
                console.log(data);
                content += "TODO<br>";
            }

            // TODO REMOVE
            if ( data.playerDiscovered == undefined && data.type != "Château" && data.type != "Château Ennemi" ) {
                data.playerDiscovered   = JSON.parse( $(this).attr('data-case')).playerDiscovered;
                data.enemyDiscovered    = JSON.parse( $(this).attr('data-case')).enemyDiscovered;
                data.id                 = JSON.parse( $(this).attr('data-case')).id;
                content += "<hr>";
            }
            content += "Case #" + data.id + "<br>";
            content += "<span class='text-success'>Player discovered : </span>" + ( data.playerDiscovered? '<b class="text-success">OUI</b>' : '<span style="font-size: 70%;">NON</span>' ) + "<br>";
            content += "<span class='text-danger'>Enemy discovered : </span>" + ( data.enemyDiscovered? '<b class="text-danger">OUI</b>' : '<span style="font-size: 70%;">NON</span>' ) + "<br>";

            if ( data.isEnemy ) {
                title += " ennemi";
            }

            $(this).popover({
                animation: true,
                html: true,
                content: content,
                placement: "top",
                title: title
            }).popover('show');
        }
    }).mouseleave(function() {
       $(this).popover('destroy');
    });
});