var View=function(){
    var elOp1=document.getElementById('op1')
        , elOp2=document.getElementById('op2')
        , elAnswer=document.getElementById('answer')
        , elBtnNext=document.getElementById('btnNext')
        , elBase=document.getElementById('base')
        , elProgress=document.getElementById('progress')
        , elFeedback=document.getElementById('feedback')
		, elForm=document.getElementById('form')
		, elSetup=document.getElementById('setup')
        , elResult=document.getElementById('result')
        , elBasePopulate=function(){
            var elOpt;
            for(var i=1; i<=13; i++){
                elOpt=document.createElement('option');
                elOpt.value=i;
                elOpt.innerHTML=i.toString();
                elBase.appendChild(elOpt);
            }
            elOpt=document.createElement('option');
            elOpt.value='random';
            elOpt.innerHTML='Random';
            elBase.appendChild(elOpt);
        }, elBase_change=function(event){
            dispatchEvent(new CustomEvent('seven.resetbase', {'detail':{'newbase':event.srcElement.options[event.srcElement.options.selectedIndex].value}}));
        }
        , showResult=function(){
            elResult.className='show';
            elForm.className='hide';

            var good=0, bad=0, total=0;
            for(var p in result )
                if(result[p])good+=1;
                else bad+=1;
            total=good+bad;
            var newp=document.createElement('p');
            newp.innerHTML='You answered '+good+ ' out of ' + total+'<br>';
            newp.innerHTML+=(good/total*100).toFixed(0)+'%';
            elResult.insertBefore(newp, elResult.childNodes[elResult.childNodes.length-2]);
            btnReload.focus();
        }
        , answer_keydown=function(event){
            if(elBtnNext.disabled){
                if(event.keyCode==9)event.preventDefault();
                return;
            }
            if(event.keyCode==13||event.keyCode==9||event.keyCode==39){
                var canceled=elBtnNext.dispatchEvent(new Event('click'));
                event.preventDefault();
            }
        }, btnNext_click=function(event){
            dispatchEvent(new CustomEvent('seven.answered', {'detail':{'answer':elAnswer.value}}));
            setTimeout(function(){
                    elAnswer.value=''; 
                    elAnswer.focus();
                },100);
        }, showProgress=function(index, outof){
            elProgress.innerHTML=''+index+' / '+outof;
        }, toggleSetup=function(){
            if(elForm.className=="hide"){
                elForm.className="show";
                elSetup.className="hide";
            }else{
                elForm.className="hide";
                elSetup.className="show";
            }
        }, showSetup=function(){
            elForm.className="hide";
            if(elResult.className=='show'){
                elResult.className='hide';
                var ps=elResult.getElementsByTagName('p');
                for(var i=ps.length-1; i>=0; i--)                
                    ps[i].remove();
            }
            elSetup.className="show";
        }, updateConfigs=function(){
            var elConfig=document.getElementById('availconfig');
            // Clear any existing children
            for(var i=elConfig.childNodes.length-1; i>=0; i--)
                elConfig.childNodes[i].remove();
            for(var p in config){
                var a=document.createElement('a')
                    , adel=document.createElement('a')
                    , span=document.createElement('span');
                a.href=adel.href='#';
                a.innerHTML=p;
                adel.innerHTML='X';
                span.innerHTML='&nbsp; &nbsp;';
                (function(p){
                    a.onclick=function(){ctrl.setConfig(Config.prototype.load(JSON.stringify(config[p])))};
                    adel.onclick=function(){ctrl.removeConfig(p);};
                })(p);

                elConfig.appendChild(a);
                adel.innerHTML='Remove';
                elConfig.appendChild(span);
                elConfig.appendChild(adel);
                elConfig.appendChild(document.createElement('br'));
            }
        };

    var that=this;
    this.showQuestion=function(q){
        elAnswer.focus();
        elOp1.innerHTML=q.op1
        , elOp2.innerHTML=q.op2;
    }, this.showFeedback=function(isCorrect, index, outof, q, isOver){
        elBtnNext.disabled=true;
        var delay=(isCorrect)?500:250;
        if(isCorrect){
            elFeedback.innerHTML="Right!";
            elFeedback.setAttribute('class', 'green');
        }else{
            elFeedback.innerHTML="Not quite..";
        }
        setTimeout(function(){
            elFeedback.innerHTML='';
            elFeedback.removeAttribute('class');
            elBtnNext.disabled=false;

            if(isCorrect){
                if(isOver){
                    showResult();
                }else{
                    showProgress(index, outof);
                    that.showQuestion(q);
                }
            }
        }, delay);
    };

    // Init
    elBasePopulate();
    elAnswer.addEventListener('keydown', answer_keydown);
    elBtnNext.addEventListener('click', btnNext_click);
    elBase.addEventListener('change', elBase_change);

    this.toggleSetup=toggleSetup;
    this.showSetup=showSetup;
    this.showProgress=showProgress;
    this.updateConfigs=updateConfigs;
    return this;
};