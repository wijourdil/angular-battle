/**
 * Case declaration
 * @constructor
 */
var Case = function Case(id, col, row) {

    var config = Case.init(id, col, row);

    // Booleans
    this.playerDiscovered   = false;
    this.enemyDiscovered    = false;
    this.isSelectable       = false;

    // The Monster / Champion already in the case, null means the case is empty
    this.contains           = null;

    this.id                 = config.id;
    this.element            = config.element;
    this.col                = config.col;
    this.row                = config.row;
};

/**
 * Static init method to prevent using "new Case"
 * @returns {object}
 */
Case.init = function(id, col, row) {
    if ( isNaN(row) || row < 0 || row > window.nbLines ) {
        throw new Error("This value for Case row number is not valid (" + row + ").");
    }
    if ( isNaN(col) || col < 0 || col > window.nbColumns ) {
        throw new Error("This value for Case column number is not valid (" + col + ").");
    }
    if ( isNaN(col) || id < 0 || id > (window.nbColumns * row + col) ) {
        throw new Error("This value for Case id is not valid (id: " + id + ", col: "+ col +", row: "+ row +").");
    }

    return {
        id: id,
        element: $('#cell-'+ id),
        col: col,
        row: row
    }
};

/**
 * Add some methods to object prototype
 */
$.extend(Case.prototype, {

    /**
     * Display object on console
     */
    log: function log() {
        console.log(this);
    },

    /**
     * Check if case if empty or not (don't take care of Traps, only Champions / Monsters)
     * @param isPlayer
     * @returns {boolean}
     */
    isEmpty: function isEmpty(isPlayer) {
        var enemyTrapCondition = ( this.contains != null && this.contains.type == 'Piège' && this.contains.type.isEnemy == isPlayer );

        return ( this.contains == null || enemyTrapCondition );
    },

    /**
     * Mark cell as discovered, allowing to see its content
     * @param isEnemy
     */
    discover: function discover(isEnemy) {
        if ( isEnemy ) {
            this.enemyDiscovered = true;
        } else {
            this.element.addClass('discovered');
            this.playerDiscovered = true;
        }
    },

    /**
     * Set a case selectable
     */
    setSelectable: function setSelectable() {
        this.isSelectable = true;
    }

});