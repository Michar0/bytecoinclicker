class item{
    constructor(name,price){
        this.name=name;
        this.price=price;
    }
    getName(){
        return this.name;
    }
    getPrice(){
        return this.price;
    }
    toString()
    {
        return this.name+" "+this.price+" \u0E3F";
    }
}

class SpecialItem extends item
{
    constructor(name,prize,effect,operand)
    {
        super(name,prize);
        this.effect = effect;
        this.operand = operand;
    }
    getEffect()
    {
        return this.effect;
    }
    getOperand(){
        return this.operand;
    }
}
class Upgrade extends item{
    constructor(name,price,effectTarget,effectOperand,effectOperator,bought,description){
        super(name,price);
        this.effectTarget=effectTarget;
        this.effectOperator=effectOperator;
        this.effectOperand=effectOperand;
        this.bought=bought;
        this.description=description;
    }

    getEffectTarget(){
        return this.effectTarget;
    }
    getEffectOperator(){
        return this.effectOperator;
    }
    getEffectOperand(){
        return this.effectOperand;
    }
    buys(){
        this.bought=true;
    }
    sell(){
        this.bought=false;
    }
    getBought(){
        return this.bought;
    }
    getDescription(){
        return this.description;
    }
}

class LevelUpgrade extends item {
    constructor(name, price, priceRaise, effectTarget, effectOperand,effectOperator, level,description) {
        super(name,price);
        this.priceRaise = priceRaise;
        this.effectTarget = effectTarget;
        this.effectOperator = effectOperator;
        this.effectOperand = effectOperand;
        this.coinsPerSecond = 0;
        this.coinsPerClick = 0;
        this.level = level;
        this.description = description;
        if (this.level > 0) {
            for (var i = 0; i < this.level; i++) {
                price *= priceRaise;
                price = decimalRound(price, 0);
            }
        }
        this.price = price;
    }
    getLevel() {
        return this.level;
    }

    getPriceRaise() {
        return this.priceRaise;
    }

    getEffectTarget() {
        return this.effectTarget;
    }

    getEffectOperator() {
        return this.effectOperator;
    }

    getEffectOperand() {
        return this.effectOperand;
    }

    raiseLevel() {
        this.level += 1;
        this.price *= this.priceRaise;
        this.price = decimalRound(this.price, 0);
    }

    reduceLevel() {
        this.level -= 1;
        this.price /= this.priceRaise;
        this.price = decimalRound(this.price, 0);
    }

    toString(price, shopAmount) {
        if (price !== 0) {
            return this.name + " x" + shopAmount + " \n " + price + " \u0E3F    " + "Lv. " + this.level;
        }
        else {
            return this.name + " x" + shopAmount + " \n " + this.price + " \u0E3F   " + "Lv. " + this.level;
        }
    }

    getCoinsPerSecond() {
        return this.coinsPerSecond;
    }

    getCoinsPerClick() {
        return this.coinsPerClick;
    }

    addCoinsPerSecond(add) {
        this.coinsPerSecond += add;
    }

    subCoinsPerSecond(sub) {
        this.coinsPerSecond -= sub;
    }
    addCoinsPerClick(add) {
        this.coinsPerClick += add;
    }

    subCoinsPerClick(sub) {
        this.coinsPerClick -= sub;
    }
    getBought()
    {
        return false;
    }
    getDescription(){
        return this.description;
    }
}
