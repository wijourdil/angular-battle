/**
 * Champion declaration
 * @param type
 * @constructor
 */
var Champion = function Champion( type ) {

    var config = Champion.init(type);

    this.type       = 'Champion';
    this.name       = type;
    this.maxPv      = config.pv;
    this.pv         = config.pv;
    this.atk        = config.atk;
    this.isEnemy    = false;
};

/**
 * Static init method to prevent using "new Champion"
 * @param type
 * @returns {object}
 */
Champion.init = function( type ) {

    var authorized = {
        Tank: {
            pv: 200,
            atk: 15
        },
        Mage: {
            pv: 80,
            atk: 40
        },
        Chevalier: {
            pv: 120,
            atk: 25
        }
    };

    if ( undefined == type ) {
        throw new Error('Champion type can\'t be empty.');
    } else if ( undefined == authorized[type] ) {
        throw new Error('Champion type '+ type +' is not authorized.');
    }

    return authorized[type];
};

/**
 * Add some methods to object prototype
 */
$.extend(Champion.prototype, {

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
     * Boost Champion atk by percentage %
     * @param percentage
     */
    boostAttack: function boostAttack(percentage) {
        this.atk = Math.floor( this.atk *  ( 100 + percentage ) / 100 );
    },

    /**
     * Make Champion recover 50% of max PV
     */
    halfHeal: function halfHeal() {
        var newPV = Math.floor( this.pv + ( this.maxPv / 2 ) );

        if ( newPV > this.maxPv ) {
            this.pv = this.maxPv;
        } else {
            this.pv = newPV;
        }
    },

    /**
     * Make Champion recover full PV
     */
    fullHeal: function fullHeal() {
        this.pv = this.maxPv;
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
        return "Invoque un nouveau " + this.name + " allié.";
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
     * Determines if Champion is dead
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