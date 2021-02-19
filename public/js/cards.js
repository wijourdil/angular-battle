var Attack=function t(){t.init(),this.type="Attaque"};Attack.init=function(){},$.extend(Attack.prototype,{log:function(){console.log(this)},getDisplayName:function(){return"Carte "+this.type},getPictureName:function(){return"Attack"},getDescription:function(){return"Permet de déclarer une attaque à un Champion / Monstre ennemi sur une case adjacente."},isPosable:function(){return!1},isUsable:function(){return!0}});var Champion=function n(t){var e=n.init(t);this.type="Champion",this.name=t,this.maxPv=e.pv,this.pv=e.pv,this.atk=e.atk,this.isEnemy=!1};Champion.init=function(t){var n={Tank:{pv:200,atk:15},Mage:{pv:80,atk:40},Chevalier:{pv:120,atk:25}};if(void 0==t)throw new Error("Champion type can't be empty.");if(void 0==n[t])throw new Error("Champion type "+t+" is not authorized.");return n[t]},$.extend(Champion.prototype,{log:function(){console.log(this)},getDisplayName:function(){return"Carte "+this.type+" : "+this.name},boostAttack:function(t){this.atk=Math.floor(this.atk*(100+t)/100)},halfHeal:function(){var t=Math.floor(this.pv+this.maxPv/2);t>this.maxPv?this.pv=this.maxPv:this.pv=t},fullHeal:function(){this.pv=this.maxPv},getPictureName:function(){return this.isEnemy?this.name+"-enemy":this.name},getDescription:function(){return"Invoque un nouveau "+this.name+" allié."},isPosable:function(){return!0},isUsable:function(){return!1},canSee:function(){return!0},attackedBy:function(t){this.pv-=t.atk},isDead:function(){return this.pv<=0},isAttackable:function(){return!0},getLifePercentage:function(){return 100*this.pv/this.maxPv}});var Item=function e(t){var n=e.init(t);this.type="Objet",this.name=t,this.action=n.action;var i="Objet de type : "+this.name+".<br>";"Boost"==this.name?i+="Augmente l'attaque de 10%.":"Grand Boost"==this.name?i+="Augmente l'attaque de 25%.":"Potion"==this.name?i+="Rend au maximum 50% des PV max.":"Grande Potion"==this.name&&(i+="Rend tous les PV."),this.description=i};Item.init=function(t){var n={Potion:{action:"halfHeal"},"Grande Potion":{action:"fullHeal"},Boost:{action:"boostAttack"},"Grand Boost":{action:"bigBoostAttack"}};if(void 0==t)throw new Error("Item type can't be empty.");if(void 0==n[t])throw new Error("Item type "+t+" is not authorized.");return n[t]},$.extend(Item.prototype,{log:function(){console.log(this)},getDisplayName:function(){return"Carte "+this.type+" : "+this.name},use:function(t){this[this.action](t)},bigBoostAttack:function(t){if(!(t instanceof Champion))throw new Error("Trying to boost atk for object isn't a Champion.");t.boostAttack(25)},boostAttack:function(t){if(!(t instanceof Champion))throw new Error("Trying to boost atk for object isn't a Champion.");t.boostAttack(10)},halfHeal:function(t){if(!(t instanceof Champion))throw new Error("Trying to boost atk for object isn't a Champion.");t.halfHeal()},fullHeal:function(t){if(!(t instanceof Champion))throw new Error("Trying to boost atk for object isn't a Champion.");t.fullHeal()},getPictureName:function(){return"Item"},getDescription:function(){var t="Objet de type : "+this.name+".";return"Boost"==this.name?t+="Augmente l'attaque de 10%.":"Grand Boost"==this.name?t+="Augmente l'attaque de 25%.":"Potion"==this.name?t+="Rend au maximum 50% des PV max.":"Grande Potion"==this.name&&(t+="Rend tous les PV."),t},isPosable:function(){return!1},isUsable:function(){return!0}});var Monster=function i(t){var n=i.init(t);this.type="Monstre",this.name=t,this.maxPv=n.pv,this.pv=n.pv,this.atk=n.atk,this.canMove=!0,this.isEnemy=!1};Monster.init=function(t){var n={Dragon:{pv:150,atk:30},Gobelin:{pv:60,atk:10},Golem:{pv:100,atk:40}};if(void 0==t)throw new Error("Monster type can't be empty.");if(void 0==n[t])throw new Error("Monster type "+t+" is not authorized.");return n[t]},$.extend(Monster.prototype,{log:function(){console.log(this)},getDisplayName:function(){return"Carte "+this.type+" : "+this.name},getPictureName:function(){return this.isEnemy?this.name+"-enemy":this.name},getDescription:function(){return"Invoque un nouveau monstre "+this.name+"."},isPosable:function(){return!0},isUsable:function(){return!1},canSee:function(){return!0},attackedBy:function(t){this.pv-=t.atk},isDead:function(){return this.pv<=0},isAttackable:function(){return!0},getLifePercentage:function(){return 100*this.pv/this.maxPv}});var Move=function o(t){o.init(t),this.type="Déplacement",this.value=t,this.valueToDisplay=t};Move.init=function(t){var n={min:0,max:5};if(void 0==t)throw new Error("Move value can't be empty.");if(+t<n.min||+t>n.max)throw new Error("Move value "+t+" is not authorized.")},$.extend(Move.prototype,{log:function(){console.log(this)},getDisplayName:function(){return"Carte "+this.type+" + "+this.valueToDisplay},getPictureName:function(){return"Move"},getDescription:function(){return"Permet de déplacer un héros de "+this.value+(1==this.value?" case.":" cases.")},isPosable:function(){return!1},isUsable:function(){return!0}});var Trap=function a(t){var n=a.init(t);this.type="Piège",this.name=t,this.turnsLeft=n.duration,this.isEnemy=!1};Trap.init=function(t){var n={Simple:{duration:1},Normal:{duration:3},Complexe:{duration:5}};if(void 0==t)throw new Error("Trap type can't be empty.");if(void 0==n[t])throw new Error("Trap type "+t+" is not authorized.");return n[t]},$.extend(Trap.prototype,{log:function(){console.log(this)},getDisplayName:function(){return"Carte "+this.type+" : "+this.name},getPictureName:function(){return this.isEnemy?"Trap-enemy":"Trap"},getDescription:function(){return"Permet de poser un piège de type "+this.name+" sur une case découverte."},isPosable:function(){return!0},isUsable:function(){return!1},canSee:function(){return!1},isAttackable:function(){return!1}});