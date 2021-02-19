/**
 * Engine declaration
 * @constructor
 */
var Engine = function Engine() {

    var config = Engine.init();

    this.board   = config.board;
    this.player  = config.player1;
    this.ennemy  = config.player2;

    // Contains turn details, if it's player or ennemy turn, and the current step
    this.turn    = {
        player: true,
        step: 0
    };

    // List the existing steps
    this.steps   = {
        0: "Piocher",
        1: "Décompter pièges actifs",
        2: "Déplacer monstres",
        3: "Jouer combats",
        4: "Activer / Défausser cartes (5 max.)"
    };

    // The label of the active step
    this.activeStep = this.steps[0];

    // The card player is playing, null means we are not in "Playing card step"
    this.playingCard = null;
    // The case containing the champion we are moving, null means we are not in "Move Champion step"
    this.movingChampionCase = null;
    // Contains the champion attacking, null means we are not in "Attack enemy step"
    this.attackingElement = null;
    // Contains the game logs (useful in debug)
    this.logs = [];
};

/**
 * Static init method to prevent using "new Engine"
 * @returns {object}
 */
Engine.init = function() {

    return {
        board: new Board(),
        player1: new Player(),
        player2: new Player()
    };
};

/**
 * Add some methods to object prototype
 */
$.extend(Engine.prototype, {

    /**
     * Display object on console, or add something to logs
     */
    log: function log(message) {

        // Only log current engine object on console
        if ( undefined == message ) {
            console.log(this);
        }
        // Add a line for in-page HTML logs
        else {
            this.logs.unshift(message);
        }
    },

    /**
     * Return a new random number, with a possible max value
     * @param maximum
     * @returns {number}
     */
    random: function random(maximum) {
        if ( undefined == maximum ) {
            maximum = 1000;
        }
        return Math.floor( Math.random() * 1000 ) % maximum;
    },

    /**
     * Increment turn step
     */
    incrementStep: function incrementStep() {
        this.turn.step++;
        this.activeStep = this.steps[this.turn.step];

        if ( this.turn.step == 1 ) {
            // TODO ajouter possibilité de cacher pièges à l'adversaire & de marcher sur ces casess
            // TODO ajouter ce qu'il faut pour différencier pièges actifs & inactifs
            // TODO faire une fonction qui décompte les pieges actifs & qui rappelle cette méthode
            this.incrementStep();
        }
        if ( this.turn.step == 2 ) {
            this.board.moveMonsters( this.isPlayerTurn() );
            this.incrementStep();
        }
        if ( this.turn.step == 3 ) {
            this.board.makeMonstersAttack( this.isPlayerTurn() );
            this.incrementStep();
        }
    },

    /**
     * End player's turn
     */
    endTurn: function endTurn() {
        var monsterCases = this.board.getMonstersCases();
        for( var i in monsterCases ) {
            monsterCases[i].contains.canMove = true;
        }
        this.turn.step = 0;
        this.activeStep = this.steps[0];
        this.turn.player = !(this.turn.player);

        if ( this.turn.player == false ) {
            this.log("Fin du tour du joueur.");
            this.launchIA();
        }
    },

    /**
     * Launch the IA to play as the ennemy
     */
    launchIA: function launchIA() {
        this.log("Début du tour de l'IA.");
        this.ennemy.draw();
        this.log("L'IA a pioché.");
        this.incrementStep();
        // TODO [Evolution future] : Améliorer l'IA en la faisant se battre avec les ennemis proches, selon l'état de ses invocations et en allant au maximum vers le chateau ennemi
        // TODO [Autre idée]       : Faire des modes pour l'IA (défend sa base, extermine au maximum les ennemis, fait tout pour avancer, ...)

        // TODO mettre un "if (random > 0.33)" sur les boosts et sur chaque move, et aussi sur les traps

        // TODO faire invoquer random(1-3max) monstre/champions sur cases libres (random)
        ////////////////////////////////
        // Invoke Champions & Monsters
        ////////////////////////////////
        var _championsCards = this.ennemy.getChampions(),
            _monstersCards = this.ennemy.getMonsters(),
            _cardsToInvoke = _championsCards.concat(_monstersCards);
        for( var i in _cardsToInvoke ) {
            var card = _cardsToInvoke[i];
            this.playCard( card );
            var freeCases = this.board.getPosableCases(true);
            var chosenCase = freeCases[ this.random(freeCases.length) ];
            this.invoke(chosenCase);
            this.trashCard( card );
        }

        // TODO faire avancer (random 1-3 fois max) champions s'il y en a, directions random
        ////////////////////////
        // Make Champions move
        ////////////////////////
        var _moveCards = this.ennemy.getMoves();
        for( var i in _moveCards ) {
            var card = _moveCards[i];
            var championsCases = this.board.getChampionsCases(this.turn.player);

            if ( championsCases.length == 0 ) {
                break;
            } else {
                var championToMove = championsCases[ this.random(championsCases.length) ];

                this.playCard(card);
                this.activateCardEffect(championToMove);

                while( this.movingChampionCase != null ) {
                    var availCases = this.board.getEmptyCasesAround(this.movingChampionCase);
                    var nextCase = availCases[ this.random(availCases.length) ];
                    this.moveChampion(nextCase);
                }

                this.trashCard(card);
            }
        }

        // TODO utiliser boost sur champion random (s'il y en a)
        /////////////////////////////////
        // Use Boost cards on Champions
        /////////////////////////////////
        var _boostCards = this.ennemy.getBoosts();
        for( var i in _boostCards ) {
            var card = _boostCards[i];
            var championsCases = this.board.getChampionsCases(this.turn.player);

            if ( championsCases.length == 0 ) {
                break;
            } else {
                var championToBoost = championsCases[ this.random(championsCases.length) ];
                this.playCard(card);
                this.activateCardEffect(championToBoost);
                this.trashCard(card);
            }
        }

        ///////////////////////////////////////////////////////
        // Use Grande Potion on every Champion with -75% life
        ///////////////////////////////////////////////////////
        var _potionCards = this.ennemy.getGrandesPotions();
        for ( var i in _potionCards ) {
            var potion = _potionCards[i];
            var champions = this.board.getChampionsCases();

            champions.sort(function(a, b) {
                if ( a.contains.getLifePercentage() == b.contains.getLifePercentage() ) {
                    return a.contains.pv > b.contains.pv;
                }

                return a.contains.getLifePercentage() > b.contains.getLifePercentage();
            });

            for(var i in champions) {
                var champ = champions[i].contains;

                if ( champ.getLifePercentage() < 25 ) {
                    this.playCard(potion);
                    this.activateCardEffect( champions[i] );
                    this.trashCard(potion);
                    break;
                }
            }
        }

        ////////////////////////////////////////////////
        // Use Potion on every Champion with -50% life
        ////////////////////////////////////////////////
        _potionCards = this.ennemy.getSimplesPotions();
        for ( var i in _potionCards ) {
            var potion = _potionCards[i];
            var champions = this.board.getChampionsCases();

            champions.sort(function(a, b) {
                if ( a.contains.getLifePercentage() == b.contains.getLifePercentage() ) {
                    return a.contains.pv > b.contains.pv;
                }

                return a.contains.getLifePercentage() > b.contains.getLifePercentage();
            });

            for(var i in champions) {
                var champ = champions[i].contains;

                if ( champ.getLifePercentage() < 50 ) {
                    this.playCard(potion);
                    this.activateCardEffect( champions[i] );
                    this.trashCard(potion);
                    break;
                }
            }
        }

        // TODO poser des pièges (0-2 random) s'il y a, place random mais de préférence devant le chateau (calculer un random qui favorise les cases autour)
        // TODO Pour chaque champion en position d'attaquer, attaquer au maximum sur les cibles possibles

        this.movingChampionCase = null;
        this.attackingElement = null;
        this.playingCard = null;
        this.endTurn();
        this.log("Fin du tour de l'IA.");
        this.log("Début du tour du joueur.");
    },

    /**
     * Play a card
     * @param card
     */
    playCard: function playCard(card) {

        var cases = [];
        this.playingCard = card;

        // Can place card on grid only if it's posable
        if ( card.isPosable() ) {
            cases = this.board.getPosableCases();
        }
        // Can use card as item or move
        else if ( card.isUsable() ) {
            cases = this.board.getChampionsCases(this.turn.player);
        }

        for( var i in cases ) {
            cases[i].setSelectable();
        }
    },

    /**
     * Trash a card from player / enemy's hand
     * @param card
     */
    trashCard: function trashCard(card) {
        var prefix = "ennemy";

        if ( this.turn.player ) {
            prefix = "player";
        }

        var indexToTrash = this[prefix].hand.indexOf(card);
        var trashedCard = this[prefix].hand.splice(indexToTrash, 1)[0];
        this[prefix].trash.unshift( trashedCard );
    },

    /**
     * Invoke a new Monster / Champion on the given case
     * @param _case
     */
    invoke: function invoke(_case) {
        this.board.populate(_case, this.playingCard, this.turn.player);
        this.board.unselectCases();
        this.playingCard = null;
    },

    /**
     * Activate the effect of a move / item card
     * @param _case
     */
    activateCardEffect: function activateCardEffect(_case) {

        // If playing a Move card
        if ( this.playingCard.type == 'Déplacement' ) {

            this.board.unselectCases();

            var cases = this.board.getEmptyCasesAround(_case);
            for( var i in cases ) {
                cases[i].setSelectable();
            }

            this.movingChampionCase = _case;
        }

        // If playing an Item card
        else if ( this.playingCard.type == 'Objet' ) {
            this.playingCard.use( _case.contains );
            this.playingCard = null;
            this.board.unselectCases();
        }

        // If playing an Attack card
        else if ( this.playingCard.type == 'Attaque' ) {
            this.board.unselectCases();

            var cases = this.board.getAttackableCases(_case);
            for( var i in cases ) {
                cases[i].setSelectable();
            }
            this.attackingElement = _case.contains;
            this.playingCard = null;
        }
    },

    /**
     * Move the current moving champion to a new case
     * @param _case
     */
    moveChampion: function moveChampion(_case) {
        
        // Move Champion to new case
        var champ = this.movingChampionCase.contains;
        this.movingChampionCase.contains = null;
        _case.contains = champ;
        this.board.discoverCasesAround(_case, this.turn.player);

        // Decrement left moves
        this.playingCard.value--;

        // If no moves left, moving is over
        if ( this.playingCard.value == 0 ) {
            this.playingCard = null;
            this.movingChampionCase = null;
            this.board.unselectCases();
        }
        // Else, we let the player move again
        else {
            this.activateCardEffect(_case);
        }
    },

    /**
     * Attacks an enemy
     * @param _case
     */
    attackEnemy: function attackEnemy(_case) {
        _case.contains.attackedBy( this.attackingElement );

        this.log( this.attackingElement.name + " attaque " + _case.contains.name + " ennemi : " + this.attackingElement.atk + " points de dégâts." );

        if ( _case.contains.isDead() ) {
            _case.contains = null;
        }
        this.attackingElement = null;
        this.board.unselectCases();
    },

    /**
     * Make sure the user can play the current selected card (if not, the "Play" button is disabled)
     * @param card
     * @returns {boolean}
     */
    canPlay: function canPlay(card) {
        // Prevent using a potion without having champions for ex.
        if ( card.isUsable() && !this.board.playerHasChampions() ) {
            return false;
        }
        // Can't place a trap on the only available case
        if ( card.type == 'Piège' && !this.board.hasMoreAvailCasesThan(1) ) {
            return false
        }
        // TODO Add rule for when player wants to use a move card, make sure there are at least a case free for a champion
        // TODO add rule for attack card, to not allow if there is any enemy next to a champion

        return true;
    },

    /**
     * Determines if it's player or enemy's turn
     * @returns {boolean}
     */
    isPlayerTurn: function isPlayerTurn() {
        return this.turn.player;
    }

});