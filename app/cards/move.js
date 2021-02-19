/**
 * Move declaration
 * @param value
 * @constructor
 */
var Move = function Move( value ) {

    Move.init(value);

    this.type           = 'Déplacement';
    this.value          = value;
    this.valueToDisplay = value;
};

/**
 * Static init method to prevent using "new Move"
 * @param value
 */
Move.init = function( value ) {

    var authorized = {
        min: 0,
        max: 5
    };

    if ( undefined == value ) {
        throw new Error('Move value can\'t be empty.');
    } else if ( +value < authorized.min || +value > authorized.max ) {
        throw new Error('Move value '+ value +' is not authorized.');
    }
};

/**
 * Add some methods to object prototype
 */
$.extend(Move.prototype, {

    /**
     * Display object on console
     */
    log: function log() {
        console.log(this);
    },

    getDisplayName: function getDisplayName() {
        return "Carte " + this.type + " + " + this.valueToDisplay;
    },

    /**
     * Return picture name
     * @returns {string}
     */
    getPictureName: function getPictureName() {
        return 'Move';
    },

    /**
     * Return card description
     * @returns {string}
     */
    getDescription: function getDescription() {
        return "Permet de déplacer un héros de " + this.value + ((this.value == 1) ? " case." : " cases.");
    },

    /**
     * Determine if a card can be placed on grid
     * @returns {boolean}
     */
    isPosable: function isPosable() {
        return false;
    },

    /**
     * Determine if a card can be used as items or moves
     * @returns {boolean}
     */
    isUsable: function isUsable() {
        return true;
    }

});