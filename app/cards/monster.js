/**
 * Monster declaration
 * @param type
 * @constructor
 */
var Monster = function Monster( type ) {

    var config = Monster.init(type);

    this.type     = 'Monstre';
    this.name     = type;
    this.maxPv    = config.pv;
    this.pv       = config.pv;
    this.atk      = config.atk;
    this.canMove  = true;
    this.isEnemy  = false;
};

/**
 * Static init method to prevent using "new Monster"
 * @param type
 * @returns {object}
 */
Monster.init = function( type ) {

    var authorized = {
        Dragon: {
            pv: 150,
            atk: 30
        },
        Gobelin: {
            pv: 60,
            atk: 10
        },
        Golem: {
            pv: 100,
            atk: 40
        }
    };

    if ( undefined == type ) {
        throw new Error('Monster type can\'t be empty.');
    } else if ( undefined == authorized[type] ) {
        throw new Error('Monster type '+ type +' is not authorized.');
    }

    return authorized[type];
};

/**
 * Add some methods to object prototype
 */
$.extend(Monster.prototype, {

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
            return this.name + "-enemy";
        }

        return this.name
    },

    /**
     * Return card description
     * @returns {string}
     */
    getDescription: function getDescription() {
        return "Invoque un nouveau monstre " + this.name + ".";
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
        return true;
    },

    /**
     * Simulate an attack, the attacker is passed as parameter
     * @param enemy
     */
    attackedBy: function attackedBy(enemy) {
        this.pv -= enemy.atk;
    },

    /**
     * Determines if Monster is dead
     * @returns {boolean}
     */
    isDead: function isDead() {
        return ( this.pv <= 0 );
    },

    /**
     * Determine if a card can be the target of an attack or not
     * @returns {boolean}
     */
    isAttackable: function isAttackable() {
        return true;
    },

    /**
     * Return the percentage of life
     * @returns {number}
     */
    getLifePercentage: function getLifePercentage() {
        return 100 * this.pv / this.maxPv;
    }

});