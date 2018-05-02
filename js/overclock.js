class Overclock{
    constructor(name,price,effectTarget){
        this.name=name;
        this.price=price;
        this.effectTarget=effectTarget;
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
    toString()
    {
        return this.name+" "+this.price+" \u0E3F";
    }
}