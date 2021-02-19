var Board=function e(){var n=e.init();this.cases=n.cases,this.playerCastle=$("#bottom-castle"),this.ennemyCastle=$("#top-castle")};Board.initCases=function(){for(var e=[],n=0;n<window.nbColumns*window.nbLines;n++){var t=n%window.nbColumns,s=Math.floor(n/window.nbColumns),i=new Case(n,t,s);e.push(i)}return e},Board.init=function(){return{cases:Board.initCases()}},$.extend(Board.prototype,{log:function(){console.log(this)},discover:function(e,n,t){var s=window.nbColumns*n+e;this.cases[s].discover(t)},getDiscoveredCases:function(){var e=[];for(var n in this.cases)this.cases[n].playerDiscovered&&e.push(this.cases[n]);return e},getPosableCases:function(e){var n=[];void 0==e&&(e=!1);for(var t in this.cases){var s=!e&&this.cases[t].playerDiscovered,i=e&&this.cases[t].enemyDiscovered;(s||i)&&this.cases[t].isEmpty(!e)&&n.push(this.cases[t])}return n},getChampionsCases:function(e){var n=[];for(var t in this.cases){var s=this.cases[t];if(!s.isEmpty(e)){var i=e&&s.playerDiscovered&&!s.contains.isEnemy,a=!e&&s.enemyDiscovered&&s.contains.isEnemy;(i||a)&&"Champion"==s.contains.type&&n.push(s)}}return n},populate:function(e,n,t){e.isEmpty(t)&&(t||(n.isEnemy=!0),e.contains=n,window.engine.log("Le joueur invoque "+n.type+" "+n.name+"."),n.canSee()&&this.discoverCasesAround(e,t))},getCase:function(e,n){var t=window.nbColumns*n+e,s=this.cases[t];return s&&Math.abs(e-s.col)>1?null:s},discoverCasesAround:function(e,n){var t=this.getCase(e.col,e.row-1),s=this.getCase(e.col,e.row+1),i=this.getCase(e.col+1,e.row),a=this.getCase(e.col-1,e.row);e.discover(!n),t&&t.discover(!n),s&&s.discover(!n),a&&a.discover(!n),i&&i.discover(!n)},unselectCases:function(){for(var e in this.cases)this.cases[e].isSelectable&&(this.cases[e].isSelectable=!1)},getEmptyCasesAround:function(e){var n=[],t=window.engine.isPlayerTurn(),s=this.getCase(e.col,e.row-1),i=this.getCase(e.col,e.row+1),a=this.getCase(e.col+1,e.row),o=this.getCase(e.col-1,e.row);return void 0!=s&&s.isEmpty(t)&&n.push(s),void 0!=i&&i.isEmpty(t)&&n.push(i),void 0!=o&&o.isEmpty(t)&&n.push(o),void 0!=a&&a.isEmpty(t)&&n.push(a),n},moveMonsters:function(e){for(var n in this.cases){var t=this.cases[n];if(!t.isEmpty(e)&&"Monstre"==t.contains.type&&t.contains.canMove){var s=this.getEmptyCasesAround(t),i=Math.random()>.5&&s.length>0;if(i){var a=window.engine.random(s.length),o=t.contains;t.contains=null,o.canMove=!1,s[a].contains=o,this.discoverCasesAround(s[a],!o.isEnemy)}}}},makeMonstersAttack:function(e){for(var n in this.cases){var t=this.cases[n];if(!t.isEmpty(e)&&"Monstre"==t.contains.type){var s=this.getEnemiesAround(t);if(s.length>0){var i=Math.floor(1e3*Math.random()%s.length),a=s[i].contains;a.attackedBy(t.contains),window.engine.log(t.contains.name+(t.contains.isEnemy?" ennemi":"")+" attaque "+a.name+(a.isEnemy?" ennemi":"")+" : "+t.contains.atk+" dégâts."),a.isDead()&&(window.engine.log(a.name+(a.isEnemy?" ennemi":"")+" est mort."),s[i].contains=null)}}}},getEnemiesAround:function(e){var n=this.getAroundCases(e),t=window.engine.isPlayerTurn(),s=[];for(var i in n)!n[i].isEmpty(t)&&n[i].contains.isAttackable()&&n[i].contains.isEnemy!=e.contains.isEnemy&&s.push(n[i]);return s},getAroundCases:function(e){var n=this.getCase(e.col,e.row-1),t=this.getCase(e.col,e.row+1),s=this.getCase(e.col+1,e.row),i=this.getCase(e.col-1,e.row),a=[];return void 0!=n&&a.push(n),void 0!=t&&a.push(t),void 0!=s&&a.push(s),void 0!=i&&a.push(i),a},getMonstersCases:function(){var e=[],n=window.engine.isPlayerTurn();for(var t in this.cases){var s=this.cases[t];s.isEmpty(n)||"Monstre"!=s.contains.type||e.push(this.cases[t])}return e},getAttackableCases:function(e){var n=[],t=this.getAroundCases(e),s=window.engine.isPlayerTurn();for(var i in t){var a=t[i];a.playerDiscovered&&!a.isEmpty(s)&&a.contains.isEnemy&&n.push(a)}return n},playerHasChampions:function(){return this.getChampionsCases(!0).length>0},hasMoreAvailCasesThan:function(e){var n=0,t=window.engine.isPlayerTurn();for(var s in this.cases)this.cases[s].isEmpty(t)&&this.cases[s].playerDiscovered&&n++;return n>e}});var Case=function n(e,t,s){var i=n.init(e,t,s);this.playerDiscovered=!1,this.enemyDiscovered=!1,this.isSelectable=!1,this.contains=null,this.id=i.id,this.element=i.element,this.col=i.col,this.row=i.row};Case.init=function(e,n,t){if(isNaN(t)||0>t||t>window.nbLines)throw new Error("This value for Case row number is not valid ("+t+").");if(isNaN(n)||0>n||n>window.nbColumns)throw new Error("This value for Case column number is not valid ("+n+").");if(isNaN(n)||0>e||e>window.nbColumns*t+n)throw new Error("This value for Case id is not valid (id: "+e+", col: "+n+", row: "+t+").");return{id:e,element:$("#cell-"+e),col:n,row:t}},$.extend(Case.prototype,{log:function(){console.log(this)},isEmpty:function(e){var n=null!=this.contains&&"Piège"==this.contains.type&&this.contains.type.isEnemy==e;return null==this.contains||n},discover:function(e){e?this.enemyDiscovered=!0:(this.element.addClass("discovered"),this.playerDiscovered=!0)},setSelectable:function(){this.isSelectable=!0}});var Engine=function t(){var e=t.init();this.board=e.board,this.player=e.player1,this.ennemy=e.player2,this.turn={player:!0,step:0},this.steps={0:"Piocher",1:"Décompter pièges actifs",2:"Déplacer monstres",3:"Jouer combats",4:"Activer / Défausser cartes (5 max.)"},this.activeStep=this.steps[0],this.playingCard=null,this.movingChampionCase=null,this.attackingElement=null,this.logs=[]};Engine.init=function(){return{board:new Board,player1:new Player,player2:new Player}},$.extend(Engine.prototype,{log:function(e){void 0==e?console.log(this):this.logs.unshift(e)},random:function(e){return void 0==e&&(e=1e3),Math.floor(1e3*Math.random())%e},incrementStep:function(){this.turn.step++,this.activeStep=this.steps[this.turn.step],1==this.turn.step&&this.incrementStep(),2==this.turn.step&&(this.board.moveMonsters(this.isPlayerTurn()),this.incrementStep()),3==this.turn.step&&(this.board.makeMonstersAttack(this.isPlayerTurn()),this.incrementStep())},endTurn:function(){var e=this.board.getMonstersCases();for(var n in e)e[n].contains.canMove=!0;this.turn.step=0,this.activeStep=this.steps[0],this.turn.player=!this.turn.player,0==this.turn.player&&(this.log("Fin du tour du joueur."),this.launchIA())},launchIA:function(){this.log("Début du tour de l'IA."),this.ennemy.draw(),this.log("L'IA a pioché."),this.incrementStep();var e=this.ennemy.getChampions(),n=this.ennemy.getMonsters(),t=e.concat(n);for(var s in t){var i=t[s];this.playCard(i);var a=this.board.getPosableCases(!0),o=a[this.random(a.length)];this.invoke(o),this.trashCard(i)}var r=this.ennemy.getMoves();for(var s in r){var i=r[s],h=this.board.getChampionsCases(this.turn.player);if(0==h.length)break;var u=h[this.random(h.length)];for(this.playCard(i),this.activateCardEffect(u);null!=this.movingChampionCase;){var c=this.board.getEmptyCasesAround(this.movingChampionCase),p=c[this.random(c.length)];this.moveChampion(p)}this.trashCard(i)}var l=this.ennemy.getBoosts();for(var s in l){var i=l[s],h=this.board.getChampionsCases(this.turn.player);if(0==h.length)break;var d=h[this.random(h.length)];this.playCard(i),this.activateCardEffect(d),this.trashCard(i)}var v=this.ennemy.getGrandesPotions();for(var s in v){var m=v[s],g=this.board.getChampionsCases();g.sort(function(e,n){return e.contains.getLifePercentage()==n.contains.getLifePercentage()?e.contains.pv>n.contains.pv:e.contains.getLifePercentage()>n.contains.getLifePercentage()});for(var s in g){var w=g[s].contains;if(w.getLifePercentage()<25){this.playCard(m),this.activateCardEffect(g[s]),this.trashCard(m);break}}}v=this.ennemy.getSimplesPotions();for(var s in v){var m=v[s],g=this.board.getChampionsCases();g.sort(function(e,n){return e.contains.getLifePercentage()==n.contains.getLifePercentage()?e.contains.pv>n.contains.pv:e.contains.getLifePercentage()>n.contains.getLifePercentage()});for(var s in g){var w=g[s].contains;if(w.getLifePercentage()<50){this.playCard(m),this.activateCardEffect(g[s]),this.trashCard(m);break}}}this.movingChampionCase=null,this.attackingElement=null,this.playingCard=null,this.endTurn(),this.log("Fin du tour de l'IA."),this.log("Début du tour du joueur.")},playCard:function(e){var n=[];this.playingCard=e,e.isPosable()?n=this.board.getPosableCases():e.isUsable()&&(n=this.board.getChampionsCases(this.turn.player));for(var t in n)n[t].setSelectable()},trashCard:function(e){var n="ennemy";this.turn.player&&(n="player");var t=this[n].hand.indexOf(e),s=this[n].hand.splice(t,1)[0];this[n].trash.unshift(s)},invoke:function(e){this.board.populate(e,this.playingCard,this.turn.player),this.board.unselectCases(),this.playingCard=null},activateCardEffect:function(e){if("Déplacement"==this.playingCard.type){this.board.unselectCases();var n=this.board.getEmptyCasesAround(e);for(var t in n)n[t].setSelectable();this.movingChampionCase=e}else if("Objet"==this.playingCard.type)this.playingCard.use(e.contains),this.playingCard=null,this.board.unselectCases();else if("Attaque"==this.playingCard.type){this.board.unselectCases();var n=this.board.getAttackableCases(e);for(var t in n)n[t].setSelectable();this.attackingElement=e.contains,this.playingCard=null}},moveChampion:function(e){var n=this.movingChampionCase.contains;this.movingChampionCase.contains=null,e.contains=n,this.board.discoverCasesAround(e,this.turn.player),this.playingCard.value--,0==this.playingCard.value?(this.playingCard=null,this.movingChampionCase=null,this.board.unselectCases()):this.activateCardEffect(e)},attackEnemy:function(e){e.contains.attackedBy(this.attackingElement),this.log(this.attackingElement.name+" attaque "+e.contains.name+" ennemi : "+this.attackingElement.atk+" points de dégâts."),e.contains.isDead()&&(e.contains=null),this.attackingElement=null,this.board.unselectCases()},canPlay:function(e){return e.isUsable()&&!this.board.playerHasChampions()?!1:"Piège"!=e.type||this.board.hasMoreAvailCasesThan(1)?!0:!1},isPlayerTurn:function(){return this.turn.player}});var Player=function s(){var e=s.init();this.deck=e.deck,this.hand=e.hand,this.trash=[]};Player.initDeck=function(){var e=[];return e.push(new Champion("Tank")),e.push(new Champion("Tank")),e.push(new Champion("Mage")),e.push(new Champion("Mage")),e.push(new Champion("Chevalier")),e.push(new Champion("Chevalier")),e.push(new Monster("Dragon")),e.push(new Monster("Dragon")),e.push(new Monster("Gobelin")),e.push(new Monster("Gobelin")),e.push(new Monster("Gobelin")),e.push(new Monster("Gobelin")),e.push(new Monster("Gobelin")),e.push(new Monster("Golem")),e.push(new Monster("Golem")),e.push(new Monster("Golem")),e.push(new Trap("Simple")),e.push(new Trap("Simple")),e.push(new Trap("Simple")),e.push(new Trap("Simple")),e.push(new Trap("Simple")),e.push(new Trap("Normal")),e.push(new Trap("Normal")),e.push(new Trap("Normal")),e.push(new Trap("Complexe")),e.push(new Trap("Complexe")),e.push(new Item("Potion")),e.push(new Item("Potion")),e.push(new Item("Potion")),e.push(new Item("Grande Potion")),e.push(new Item("Grande Potion")),e.push(new Item("Boost")),e.push(new Item("Boost")),e.push(new Item("Boost")),e.push(new Item("Grand Boost")),e.push(new Item("Grand Boost")),e.push(new Move(1)),e.push(new Move(1)),e.push(new Move(1)),e.push(new Move(1)),e.push(new Move(1)),e.push(new Move(1)),e.push(new Move(1)),e.push(new Move(1)),e.push(new Move(1)),e.push(new Move(1)),e.push(new Move(1)),e.push(new Move(1)),e.push(new Move(2)),e.push(new Move(2)),e.push(new Move(2)),e.push(new Move(2)),e.push(new Move(2)),e.push(new Move(3)),e.push(new Move(3)),e.push(new Move(3)),e.push(new Move(3)),e.push(new Move(4)),e.push(new Move(4)),e.push(new Move(5)),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e.push(new Attack),e},Player.shuffle=function(e){for(var n,t,s=e.length;s;n=Math.floor(Math.random()*s),t=e[--s],e[s]=e[n],e[n]=t);return e},Player.init=function(){for(var e=Player.shuffle(Player.initDeck()),n=[],t=0;5>t;t++)n.push(e.pop());return{deck:e,hand:n}},$.extend(Player.prototype,{log:function(){console.log(this)},draw:function(){var e=this.deck.pop();this.hand.push(e)},getCards:function(e){var n=[];for(var t in this.hand)this.hand[t].type==e&&n.push(this.hand[t]);return n},getChampions:function(){return this.getCards("Champion")},getMonsters:function(){return this.getCards("Monstre")},getMoves:function(){return this.getCards("Déplacement")},getBoosts:function(){var e=[];for(var n in this.hand)("Boost"==this.hand[n].name||"Grand Boost"==this.hand[n].name)&&e.push(this.hand[n]);return e},getSimplesPotions:function(){var e=[];for(var n in this.hand)"Potion"==this.hand[n].name&&e.push(this.hand[n]);return e},getGrandesPotions:function(){var e=[];for(var n in this.hand)"Grande Potion"==this.hand[n].name&&e.push(this.hand[n]);return e}});