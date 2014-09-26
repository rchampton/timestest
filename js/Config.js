var config=JSON.parse((localStorage.config===undefined)?"{}":localStorage.config);

var Config=function(){
    this.base=1;
    this.order='forward';
    this.numberOfQuestions=13;
    this.name=undefined;

    return this;
};

Config.prototype.toString=function(){
    return 'Config base='+this.base+' order='+this.order+' numberOfQuestions='+this.numberOfQuestions+' named '+(this.name||'Unnammed');
};

Config.prototype.readFromForm=function(){
    if(document.getElementById('base').options[document.getElementById('base').selectedIndex].value=='random')
        this.base='random';
    else 
        this.base=(document.getElementById('base').options[document.getElementById('base').selectedIndex].value)>>0;

    this.order='forward';
    var orderOpts=document.getElementsByName('cfgOrder');
    for(var i=0, max=orderOpts.length; i<max; i++)
        if(orderOpts[i].checked)
            this.order=orderOpts[i].value;
    this.numberOfQuestions=document.getElementById('cfgNumQuestions').value>>0;
    this.name=document.getElementById('cfgName').value;
    if(this.name=='')this.name=undefined;
};

Config.prototype.load=function(configAsJSON){
    var o=JSON.parse(configAsJSON);

    this.base=o.base;
    this.order=o.order;
    this.numberOfQuestions=o.numberOfQuestions;
    this.name=o.name;

    return this;
};