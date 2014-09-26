var Timestable=function(baseStart, baseEnd){
    this.baseStart=baseStart;
    this.baseEnd=baseEnd;
    this.rows=[];
    for(var b=baseStart; b<=baseEnd; b++)
        this.rows.push(new TTRow(b));
    return this;
};
Timestable.prototype.print=function(){
    var output=this.rows[0].print()+'\n';
    for(var i=1; i<this.rows.length; i++)
        output+=this.rows[i].print(false)+'\n';
    return output;
};
Timestable.prototype.valueAt=function(rowIndex, colIndex){
    return (rowIndex<1||rowIndex>13)
        ?undefined
        :this.rows[rowIndex-1].valueAt(colIndex);
};
Timestable.prototype.rowAt=function(rowIndex){return this.rows[rowIndex-1];};

var TTRow=function(base){return new TimestableRow(base, 1, 13);};

var TimestableRow=function(base, start, end){
  this.base=base;
  this.start=start;
  this.end=end;
  this.padlen=(this.base*this.end).toString().length+1;
  this.values=[];
  for(var i=start; i<end; i++)
    this.values.push(i*this.base);

  return this;
};
TimestableRow.prototype.print=function(withHeader){
  if(withHeader==undefined)
    withHeader=true;
  var output='';
  if(withHeader){
      for(var i=this.start; i<=this.end; i++)
        output+=(Array(this.padlen).join(' ')+i).substr(-1*this.padlen);
      output+='\n';
      for(var i=this.start; i<=this.end; i++)
        output+=(Array(this.padlen).join(' ')+('--')).substr(-1*this.padlen);
      output+='\n';
  }
  for(var i=this.start; i<=this.end; i++)
    output+=(Array(this.padlen).join(' ')+(this.base*i)).substr(-1*this.padlen);
  return output;
};
TimestableRow.prototype.valueAt=function(index){
    if(index<1||(index>(this.end-this.start+1)))return undefined;
    return this.base*(this.start+index-1);
};
TimestableRow.prototype.asArray=function(){
    var result=[];
    for(var i=0; i<this.end-this.start; i++){
        result.push(this.valueAt(i+1));
    }
};
TimestableRow.prototype.test=function(){
    var ttr2=new TimestableRow(2,1,13);
};