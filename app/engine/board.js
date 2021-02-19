/**
 * Board declaration
 * @constructor
 */
var Board = function Board() {

    var config = Board.init();

    this.cases = config.cases;
    this.playerCastle = $('#bottom-castle');
    this.ennemyCastle = $('#top-castle');
};

/**
 *
 * @returns {Array}
 */
Board.initCases = function() {

    var cases = [];

    // TODO gérer liste cases ici
    for(var i = 0 ; i < (window.nbColumns * window.nbLines) ; i++) {
        var col = i % window.nbColumns,
            row = Math.floor( i / window.nbColumns),
            _case = new Case(i, col, row);

        cases.push( _case );
    }

    return cases;
};

/**
 * Static init method to prevent using "new Board"
 * @returns {object}
 */
Board.init = function() {
    return {
        cases: Board.initCases()
    }
};

/**
 * Add some methods to object prototype
 */
$.extend(Board.prototype, {

    /**
     * Display object on console
     */
    log: function log() {
        console.log(this);
    },

    /**
     * Discover a new case
     * @param col
     * @param row
     * @param isEnemy
     */
    discover: function discover(col, row, isEnemy) {
        var index = window.nbColumns * row + col;
        this.cases[index].discover(isEnemy);
    },

    /**
     * Get the list of discovered cases
     * @returns {Array}
     */
    getDiscoveredCases: function getDiscoveredCases() {
        var casesToReturn = [];

        for(var i in this.cases) {
            if ( this.cases[i].playerDiscovered ) {
                casesToReturn.push(this.cases[i]);
            }
        }

        return casesToReturn;
    },

    /**
     * Get the list of posable cases (empty & discovered)
     * @param isEnemyTurn
     * @returns {Array}
     */
    getPosableCases: function getPosableCases(isEnemyTurn) {
        var casesToReturn = [];

        if ( undefined == isEnemyTurn ) {
            isEnemyTurn = false;
        }

        for(var i in this.cases) {
            var playerDiscovered = ( !isEnemyTurn && this.cases[i].playerDiscovered ),
                enemyDiscovered  = ( isEnemyTurn && this.cases[i].enemyDiscovered );

            if ( ( playerDiscovered || enemyDiscovered ) && this.cases[i].isEmpty( !isEnemyTurn ) ) {
                casesToReturn.push(this.cases[i]);
            }
        }

        return casesToReturn;
    },

    /**
     * Get the list of cases containing a Champion
     * @param isPlayer
     * @returns {Array}
     */
    getChampionsCases: function getChampionsCases(isPlayer) {
        var casesToReturn = [];

        for(var i in this.cases) {
            var tmp_case = this.cases[i];

            if ( !tmp_case.isEmpty(isPlayer) ) {
                var playerCondition = isPlayer && tmp_case.playerDiscovered && !tmp_case.contains.isEnemy,
                    enemyCondition = !isPlayer && tmp_case.enemyDiscovered && tmp_case.contains.isEnemy;

                if ( ( playerCondition || enemyCondition ) && tmp_case.contains.type == 'Champion' ) {
                    casesToReturn.push(tmp_case);
                }
            }
        }

        return casesToReturn;
    },

    /**
     * Populate a given case with a given card object
     * @param _case
     * @param card
     * @param isPlayer
     */
    populate: function populate(_case, card, isPlayer) {
        if ( _case.isEmpty(isPlayer) ) {

            if ( !isPlayer ) {
                card.isEnemy = true;
            }
            _case.contains = card;

            window.engine.log("Le joueur invoque " + card.type + " " + card.name + ".");

            if ( card.canSee() ) {
                this.discoverCasesAround(_case, isPlayer);
            }
        }
    },

    /**
     * Get a case with it's coords
     * @param col
     * @param row
     * @returns {Case}
     */
    getCase: function getCase(col, row) {
        var index = window.nbColumns * row + col;
        var _case = this.cases[index];

        // Prevent from "bug" when try to discover extreme left column cell from extreme right column cell
        if ( _case && Math.abs(col - _case.col) > 1 ) {
            return null;
        }

        return _case;
    },

    /**
     * Discover cases around a given case
     * @param _case
     * @param isPlayer
     */
    discoverCasesAround: function discoverCasesAround(_case, isPlayer) {

        var northCase = this.getCase(_case.col, _case.row - 1);
        var southCase = this.getCase(_case.col, _case.row + 1);
        var eastCase  = this.getCase(_case.col + 1, _case.row);
        var westCase  = this.getCase(_case.col - 1, _case.row);

        _case.discover(!isPlayer);
        if (northCase) northCase.discover(!isPlayer);
        if (southCase) southCase.discover(!isPlayer);
        if (westCase) westCase.discover(!isPlayer);
        if (eastCase) eastCase.discover(!isPlayer);
    },

    /**
     * Make all cases unselectable
     */
    unselectCases: function unselectCases() {
        for ( var i in this.cases ) {
            if ( this.cases[i].isSelectable ) {
                this.cases[i].isSelectable = false;
            }
        }
    },

    /**
     * Get the list of empty cases around a given Case
     * @param _case
     * @returns {Array}
     */
    getEmptyCasesAround: function getEmptyCasesAround(_case) {
        var cases = [];
        // TODO do it better ?
        var isPlayer = window.engine.isPlayerTurn();
        var northCase = this.getCase(_case.col, _case.row - 1);
        var southCase = this.getCase(_case.col, _case.row + 1);
        var eastCase  = this.getCase(_case.col + 1, _case.row);
        var westCase  = this.getCase(_case.col - 1, _case.row);

        if ( northCase != undefined && northCase.isEmpty(isPlayer) ) {
            cases.push( northCase );
        }
        if ( southCase != undefined && southCase.isEmpty(isPlayer) ) {
            cases.push( southCase );
        }
        if ( westCase != undefined && westCase.isEmpty(isPlayer) ) {
            cases.push( westCase );
        }
        if ( eastCase != undefined && eastCase.isEmpty(isPlayer) ) {
            cases.push( eastCase );
        }

        return cases;
    },

    /**
     * Move all monsters on the Board
     * @param isPlayer
     */
    moveMonsters: function moveMonsters(isPlayer) {
        for( var i in this.cases ) {

            var oldCase = this.cases[i];

            if ( !oldCase.isEmpty(isPlayer) && oldCase.contains.type == 'Monstre' && oldCase.contains.canMove ) {

                var possibleCases = this.getEmptyCasesAround(oldCase);
                var willMove = (Math.random() > 0.5) && (possibleCases.length > 0);

                if ( willMove ) {
                    var nextCase = window.engine.random(possibleCases.length);
                    var monster = oldCase.contains;

                    oldCase.contains = null;
                    monster.canMove = false;
                    possibleCases[nextCase].contains = monster;
                    this.discoverCasesAround( possibleCases[nextCase], !monster.isEnemy );
                }
            }
        }
    },

    /**
     * Make all monsters placed next to an enemy attack
     * @param isPlayer
     */
    makeMonstersAttack: function makeMonstersAttack(isPlayer) {

        for( var i in this.cases ) {

            var _case = this.cases[i];

            if( !_case.isEmpty(isPlayer) && _case.contains.type == 'Monstre' ) {

                var enemiesAround = this.getEnemiesAround(_case);

                if ( enemiesAround.length > 0 ) {
                    var randIndex = Math.floor( ( Math.random() * 1000 ) % enemiesAround.length );
                    var target = enemiesAround[randIndex].contains;
                    target.attackedBy( _case.contains );
                    window.engine.log(_case.contains.name + ( _case.contains.isEnemy ? ' ennemi' : '' )
                        + " attaque " + target.name + ( target.isEnemy ? ' ennemi' : '' ) + " : " + _case.contains.atk + " dégâts.");
                    if ( target.isDead() ) {
                        window.engine.log(target.name + ( target.isEnemy ? ' ennemi' : '' ) + " est mort.");
                        enemiesAround[randIndex].contains = null;
                    }
                }
            }
        }
    },

    /**
     * Get the list of cases containing enemies around a given case
     * @param _case
     * @returns {Array}
     */
    getEnemiesAround: function getEnemiesAround(_case) {
        var aroundCases = this.getAroundCases(_case);
        // TODO dot it better ? AngularJS global ?
        var isPlayer = window.engine.isPlayerTurn();
        var enemies = [];

        for( var i in aroundCases ) {
            if ( !aroundCases[i].isEmpty(isPlayer) && aroundCases[i].contains.isAttackable() && aroundCases[i].contains.isEnemy != _case.contains.isEnemy ) {
                enemies.push( aroundCases[i] );
            }
        }

        return enemies;
    },

    /**
     * Get the cases around the given case (may contain less than 4 cases, if we are at a border for example)
     * @param _case
     * @returns {Array}
     */
    getAroundCases: function getAroundCases(_case) {
        var northCase = this.getCase(_case.col, _case.row - 1);
        var southCase = this.getCase(_case.col, _case.row + 1);
        var eastCase  = this.getCase(_case.col + 1, _case.row);
        var westCase  = this.getCase(_case.col - 1, _case.row);
        var returnCases = [];
        
        if ( northCase != undefined ) returnCases.push(northCase);
        if ( southCase != undefined ) returnCases.push(southCase);
        if ( eastCase != undefined ) returnCases.push(eastCase);
        if ( westCase != undefined ) returnCases.push(westCase);

        return returnCases;
    },

    /**
     * Get the list of cases containing a Monster
     * @returns {Array}
     */
    getMonstersCases: function getMonstersCases() {
        var casesToReturn = [];
        // TODO do it better ?
        var isPlayer = window.engine.isPlayerTurn();

        for(var i in this.cases) {
            var tmp_case = this.cases[i];

            if ( !tmp_case.isEmpty(isPlayer) && tmp_case.contains.type == 'Monstre' ) {
                casesToReturn.push(this.cases[i]);
            }
        }

        return casesToReturn;
    },

    /**
     * Get the list of cases attackable by Champion
     * @param _case
     * @returns {Array}
     */
    getAttackableCases: function getAttackableCases(_case) {
        var casesToReturn = [];
        var _cases = this.getAroundCases(_case);
        // TODO do it better ?
        var isPlayer = window.engine.isPlayerTurn();

        for(var i in _cases) {
            var tmp_case = _cases[i];

            if ( tmp_case.playerDiscovered && !tmp_case.isEmpty(isPlayer) && tmp_case.contains.isEnemy ) {
                casesToReturn.push(tmp_case);
            }
        }

        return casesToReturn;
    },

    /**
     * Determines if player has Champions or not on the Board
     * @returns {boolean}
     */
    playerHasChampions: function playerHasChampions() {
        return ( this.getChampionsCases(true).length > 0 );
    },

    /**
     * Make sure the player has enough available cases
     * @param number
     * @returns {boolean}
     */
    hasMoreAvailCasesThan: function hasMoreAvailCasesThan(number) {
        var count = 0;
        // TODO do it better ? angularJS global ?
        var isPlayer = window.engine.isPlayerTurn();

        for(var i in this.cases) {
            if ( this.cases[i].isEmpty(isPlayer) && this.cases[i].playerDiscovered ) {
                count++;
            }
        }

        return (count > number);
    }

});