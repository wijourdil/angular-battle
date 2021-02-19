/**
 * Attack declaration
 * @constructor
 */
var Attack = function Attack() {

    Attack.init();

    this.type  = 'Attaque';
};

/**
 * Static init method to prevent using "new Attack"
 */
Attack.init = function() {
    // Does nothing
};

/**
 * Add some methods to object prototype
 */
$.extend(Attack.prototype, {

    /**
     * Display object on console
     */
    log: function log() {
        console.log(this);
    },

    getDisplayName: function getDisplayName() {
        return "Carte " + this.type;
    },

    /**
     * Return picture name
     * @returns {string}
     */
    getPictureName: function getPictureName() {
        return "Attack";
    },

    /**
     * Return card description
     * @returns {string}
     */
    getDescription: function getDescription() {
        return "Permet de déclarer une attaque à un Champion / Monstre ennemi sur une case adjacente.";
    },

    /**
     * Determine if a card can be placed on grid
     * @returns {boolean}
     */
    isPosable: function isPosable() {
        return false;
    },

    /**
     * Determine if a card can be used as items or Attacks
     * @returns {boolean}
     */
    isUsable: function isUsable() {
        return true;
    }

});