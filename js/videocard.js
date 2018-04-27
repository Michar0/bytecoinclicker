class Videocard{
    constructor(name,price,priceRaise,effectTarget,effectOperand,level) {
        this.name = name;
        this.price = price;
        this.priceRaise = priceRaise;
        this.effectTarget = effectTarget;
        this.effectOperand = effectOperand;
        this.coinsPerSecond = level*effectOperand;
        this.level=level;
        this.overclocked=false;
    }
    getName(){
        return this.name;
    }
    getPrice(){
        return this.price;
    }
    getLevel()
    {
        return this.level;
    }
    getEffectTarget(){
        return this.effectTarget;
    }
    getEffectOperand(){
        return this.effectOperand;
    }
    getCoinsPerSecond(){
        return this.coinsPerSecond;
    }
    getOverclock(){
        return this.overclocked;
    }
    addCoinsPerSecond(add){
        this.coinsPerSecond+=add;
    }
    overclock()
    {
        this.overclocked=true;
        this.coinsPerSecond*=2;
        this.effectOperand*=2;
    }
    raiseLevel()
    {
        this.level+=1;
        this.price*=this.priceRaise;
        this.price=decimalRound(this.price,0);
    }
    toString()
    {
        return this.name+" x"+this.level+" \n "+this.price+" \u0E3F";
    }
}