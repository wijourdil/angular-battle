/**
 * Item declaration
 * @param type
 * @constructor
 */
var Item = function Item( type ) {

    var config = Item.init(type);

    this.type       = 'Objet';
    this.name       = type;
    this.action     = config.action;

    var desc = "Objet de type : " + this.name + ".<br>";

    if ( this.name == "Boost" ) {
        desc += "Augmente l'attaque de 10%.";
    } else if ( this.name == "Grand Boost" ) {
        desc += "Augmente l'attaque de 25%.";
    } else if ( this.name == "Potion" ) {
        desc += "Rend au maximum 50% des PV max.";
    } else if ( this.name == "Grande Potion" ) {
        desc += "Rend tous les PV.";
    }

    this.description = desc;
};

/**
 * Static init method to prevent using "new Item"
 * @param type
 * @returns {object}
 */
Item.init = function( type ) {

    var authorized = {
        Potion: {
            action: "halfHeal"
        },
        "Grande Potion": {
            action: "fullHeal"
        },
        Boost: {
            action: "boostAttack"
        },
        "Grand Boost": {
            action: "bigBoostAttack"
        }
    };

    if ( undefined == type ) {
        throw new Error('Item type can\'t be empty.');
    } else if ( undefined == authorized[type] ) {
        throw new Error('Item type '+ type +' is not authorized.');
    }

    return authorized[type];
};

/**
 * Add some methods to object prototype
 */
$.extend(Item.prototype, {

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
     * Method to call to use an Item
     */
    use: function use( target ) {
        this[this.action](target);
    },

    /**
     * Increase Champion atk by 25%
     * @param champion
     */
    bigBoostAttack: function bigBoostAttack( champion ) {
        if( champion instanceof Champion ) {
            champion.boostAttack(25);
        } else {
            throw new Error('Trying to boost atk for object isn\'t a Champion.');
        }
    },

    /**
     * Increase Champion atk by 10%
     * @param champion
     */
    boostAttack: function boostAttack( champion ) {
        if( champion instanceof Champion ) {
            champion.boostAttack(10);
        } else {
            throw new Error('Trying to boost atk for object isn\'t a Champion.');
        }
    },

    /**
     * Make Champion recover 50% of max PV
     * @param champion
     */
    halfHeal: function halfHeal( champion ) {
        if( champion instanceof Champion ) {
            champion.halfHeal();
        } else {
            throw new Error('Trying to boost atk for object isn\'t a Champion.');
        }
    },

    /**
     * Make Champion recover full PV
     * @param champion
     */
    fullHeal: function fullHeal( champion ) {
        if( champion instanceof Champion ) {
            champion.fullHeal();
        } else {
            throw new Error('Trying to boost atk for object isn\'t a Champion.');
        }
    },

    /**
     * Return picture name
     * @returns {string}
     */
    getPictureName: function getPictureName() {
        return "Item";
    },

    /**
     * Return card description
     * @returns {string}
     */
    getDescription: function getDescription() {
        var desc = "Objet de type : " + this.name + ".";

        if ( this.name == "Boost" ) {
            desc += "Augmente l'attaque de 10%.";
        } else if ( this.name == "Grand Boost" ) {
            desc += "Augmente l'attaque de 25%.";
        } else if ( this.name == "Potion" ) {
            desc += "Rend au maximum 50% des PV max.";
        } else if ( this.name == "Grande Potion" ) {
            desc += "Rend tous les PV.";
        }

        return desc;
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