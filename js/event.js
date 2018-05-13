class SpecialEvent{
    constructor(name,target,operand,image,duration){
        this.name=name;
        this.target=target;
        this.operand=operand;
        this.image=image;
        this.duration=duration;
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
    getDuration(){
        return this.duration;
    }
}