class SpecialEvent{
    constructor(name,target,operand,image){
        this.name=name;
        this.target=target;
        this.operand=operand;
        this.image=image;
    }

    getName(){
        return this.name;
    }
    getTarget(){
        return this.target;
    }
    getOperand(){
        return this.operand;
    }
    getImage(){
        return this.image;
    }
}