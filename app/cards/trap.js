/**
 * Trap declaration
 * @param type
 * @constructor
 */
var Trap = function Trap( type ) {

    var config = Trap.init(type);

    this.type       = 'Piège';
    this.name       = type;
    this.turnsLeft  = config.duration;
    this.isEnemy    = false;
    // TODO ajouter attribut "active" et l'afficher dans le popover
};

/**
 * Static init method to prevent using "new Trap"
 * @param type
 * @returns {object}
 */
Trap.init = function( type ) {

    var authorized = {
        Simple: {
            duration: 1
        },
        Normal: {
            duration: 3
        },
        Complexe: {
            duration: 5
        }
    };

    if ( undefined == type ) {
        throw new Error('Trap type can\'t be empty.');
    } else if ( undefined == authorized[type] ) {
        throw new Error('Trap type '+ type +' is not authorized.');
    }

    return authorized[type];
};

/**
 * Add some methods to object prototype
 */
$.extend(Trap.prototype, {

    /**
     * Display object on console
     */
    log: function log() {
        console.log(this);
    },

    getDisplayName: function getDisplayName() {
        return "Carte " + this.type + " : " + this.name;
    },

    /**
     * Return picture name
     * @returns {string}
     */
    getPictureName: function getPictureName() {
        if ( this.isEnemy ) {
            return "Trap-enemy";
        }

        return "Trap";
    },

    /**
     * Return card description
     * @returns {string}
     */
    getDescription: function getDescription() {
        return "Permet de poser un piège de type " + this.name + " sur une case découverte.";
    },

    /**
     * Determine if a card can be placed on grid
     * @returns {boolean}
     */
    isPosable: function isPosable() {
        return true;
    },

    /**
     * Determine if a card can be used as items or moves
     * @returns {boolean}
     */
    isUsable: function isUsable() {
        return false;
    },

    /**
     * Determine if a card can see, and so discover cases around
     * @returns {boolean}
     */
    canSee: function canSee() {
        return false;
    },

    /**
     * Determine if a card can be the target of an attack or not
     * @returns {boolean}
     */
    isAttackable: function isAttackable() {
        return false;
    }

});