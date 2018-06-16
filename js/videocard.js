class Videocard extends LevelUpgrade{
    constructor(name,price,priceRaise,effectTarget,effectOperand,effectOperator,level) {
        super(name,price,priceRaise,effectTarget,effectOperator,effectOperand,level);
        this.overclocked=false;
        this.health=100;
    }

    getOverclock(){
        return this.overclocked;
    }
    overclock()
    {
        this.overclocked=true;
        this.coinsPerSecond*=2;
        this.effectOperand*=2;
    }
    extremeOverclock()
    {
        this.coinsPerSecond*=4;
        this.effectOperand*=4;
    }
    reduceHealth(){
        this.health--;
    }
    underclock()
    {
        this.overclocked=false;
        this.coinsPerSecond/=2;
        this.effectOperand/=2;
    }
    getHealth()
    {
        return this.health;
    }
    extremeUnderclock()
    {
        this.coinsPerSecond/=4;
        this.effectOperand/=4;
    }
}