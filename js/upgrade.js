class Upgrade{
    constructor(name,price,effectTarget,effectOperand){
        this.name=name;
        this.price=price;
        this.effectTarget=effectTarget;
        this.multiplier=effectOperand;
    }

    getName(){
        return this.name;
    }
    getPrice(){
        return this.price;
    }
    getEffectTarget(){
        return this.effectTarget;
    }
    getMultiplier(){
        return this.multiplier;
    }
    toString()
    {
        return this.name+" "+this.price+" \u0E3F";
    }
}