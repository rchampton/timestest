var Question=function(op1, op2, answer){
    this.op1=op1||0;
    this.op2=op2||0;
    this.answer=answer||(op1*op2);

    return this;
};

Question.prototype.toString=function(){
    return ''+this.op1+' * '+this.op2+' = '+this.answer;
};