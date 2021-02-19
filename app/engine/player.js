/**
 * Player declaration
 * @constructor
 */
// TODO Créer la classe Player, qui contient une liste de cartes, de champions, d'items et de pieges
var Player = function Player() {

    var config = Player.init();

    this.deck   = config.deck;
    this.hand   = config.hand;
    this.trash  = [];
};

/**
 * Initialize Player deck
 * @returns {Array}
 */
Player.initDeck = function() {

    var deck = [];

    // Add Champions (6 cards)
    deck.push( new Champion('Tank') );
    deck.push( new Champion('Tank') );
    deck.push( new Champion('Mage') );
    deck.push( new Champion('Mage') );
    deck.push( new Champion('Chevalier') );
    deck.push( new Champion('Chevalier') );
    // Add Monsters (10 cards)
    deck.push( new Monster('Dragon') );
    deck.push( new Monster('Dragon') );
    deck.push( new Monster('Gobelin') );
    deck.push( new Monster('Gobelin') );
    deck.push( new Monster('Gobelin') );
    deck.push( new Monster('Gobelin') );
    deck.push( new Monster('Gobelin') );
    deck.push( new Monster('Golem') );
    deck.push( new Monster('Golem') );
    deck.push( new Monster('Golem') );
    // Add Traps (10 cards)
    deck.push( new Trap('Simple') );
    deck.push( new Trap('Simple') );
    deck.push( new Trap('Simple') );
    deck.push( new Trap('Simple') );
    deck.push( new Trap('Simple') );
    deck.push( new Trap('Normal') );
    deck.push( new Trap('Normal') );
    deck.push( new Trap('Normal') );
    deck.push( new Trap('Complexe') );
    deck.push( new Trap('Complexe') );
    // Add Items (10 cards)
    deck.push( new Item('Potion') );
    deck.push( new Item('Potion') );
    deck.push( new Item('Potion') );
    deck.push( new Item('Grande Potion') );
    deck.push( new Item('Grande Potion') );
    deck.push( new Item('Boost') );
    deck.push( new Item('Boost') );
    deck.push( new Item('Boost') );
    deck.push( new Item('Grand Boost') );
    deck.push( new Item('Grand Boost') );
    // Add Moves (24 cards)
    deck.push( new Move(1) );
    deck.push( new Move(1) );
    deck.push( new Move(1) );
    deck.push( new Move(1) );
    deck.push( new Move(1) );
    deck.push( new Move(1) );
    deck.push( new Move(1) );
    deck.push( new Move(1) );
    deck.push( new Move(1) );
    deck.push( new Move(1) );
    deck.push( new Move(1) );
    deck.push( new Move(1) );   // 12 cards +1
    deck.push( new Move(2) );
    deck.push( new Move(2) );
    deck.push( new Move(2) );
    deck.push( new Move(2) );
    deck.push( new Move(2) );   // 5 cards +2
    deck.push( new Move(3) );
    deck.push( new Move(3) );
    deck.push( new Move(3) );
    deck.push( new Move(3) );   // 4 cards +3
    deck.push( new Move(4) );
    deck.push( new Move(4) );   // 2 cards +4
    deck.push( new Move(5) );   // 1 card  +5
    // Add Attacks (20 cards)
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );  // 10 first attack cards
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );
    deck.push( new Attack() );  // 10 last attack cards

    return deck;
};

/**
 * Shuffle deck
 * @param deck
 * @returns {*}
 */
Player.shuffle = function(deck){
    for(var j, x, i = deck.length; i; j = Math.floor(Math.random() * i), x = deck[--i], deck[i] = deck[j], deck[j] = x);
    return deck;
};

/**
 * Static init method to prevent using "new Player"
 * @returns {object}
 */
Player.init = function() {

    var _deck = Player.shuffle( Player.initDeck());
    var _hand = [];

    for(var i = 0 ; i < 5 ; i++) {
        _hand.push( _deck.pop() );
    }

    return {
        deck: _deck,
        hand: _hand
    };
};

/**
 * Add some methods to object prototype
 */
$.extend(Player.prototype, {

    /**
     * Display object on console
     */
    log: function log() {
        console.log(this);
    },

    /**
     * Draw a new card
     */
    draw: function draw() {
        var drawed = this.deck.pop();
        this.hand.push(drawed);
    },

    /**
     * Get the list of cards in the hand, by type
     * @param type
     * @returns {Array}
     */
    getCards: function getCards(type) {
        var cards = [];

        for(var i in this.hand) {
            if( this.hand[i].type == type ) {
                cards.push(this.hand[i]);
            }
        }

        return cards;
    },

    /**
     * Return the list of Champions in the hand
     * @returns {Array}
     */
    getChampions: function getChampions() {
        return this.getCards("Champion");
    },

    /**
     * Return the list of Monsters in the hand
     * @returns {Array}
     */
    getMonsters: function getMonsters() {
        return this.getCards("Monstre");
    },

    /**
     * Return the list of Moves in the hand
     * @returns {Array}
     */
    getMoves: function getMoves() {
        return this.getCards("Déplacement");
    },


    /**
     * Return the list of Boost in the hand
     * @returns {Array}
     */
    getBoosts: function getBoosts() {
        var cards = [];

        for(var i in this.hand) {
            if( this.hand[i].name == "Boost" || this.hand[i].name == "Grand Boost" ) {
                cards.push(this.hand[i]);
            }
        }

        return cards;
    },

    /**
     * Return the list of Potions in the hand
     * @returns {Array}
     */
    getSimplesPotions: function getSimplesPotions() {
        var cards = [];

        for(var i in this.hand) {
            if( this.hand[i].name == "Potion" ) {
                cards.push(this.hand[i]);
            }
        }

        return cards;
    },

    /**
     * Return the list of Potions in the hand
     * @returns {Array}
     */
    getGrandesPotions: function getGrandesPotions() {
        var cards = [];

        for(var i in this.hand) {
            if( this.hand[i].name == "Grande Potion" ) {
                cards.push(this.hand[i]);
            }
        }

        return cards;
    }
});