var Ctrl=function(view){
    var that=this;
    this.user='User'
    , this.missedQuestions=[]
    , this.currConfig
    , this.questions=[]
    , this._hasQuestions=true
    , this.view=view
    , this.tt=new Timestable(1,13)
    , this.ttr=this.tt.rowAt(3)
    , this.rowIndex=0
    , this.hasQuestions=function(){return that._hasQuestions;}
    , this.currAnswer=function(){return that.questions[that.rowIndex].answer||undefined;}
    , this.reload=function(){window.location.reload();}
    , this.answered=function(event){
        if(that.currAnswer()==event.detail.answer){
            if(!result.hasOwnProperty(that.rowIndex))
                result[that.rowIndex]=true;
            that.rowIndex+=1;
            var isOver=(that.rowIndex>that.currConfig.numberOfQuestions-1)?true:false;
            if(isOver){
                that.rowIndex=0;
            }
            view.showFeedback(true, that.rowIndex, that.questions.length, that.getQuestion(), isOver, that.currConfig.baseFirst);
        }else{
            if(!result.hasOwnProperty(that.rowIndex)){
                result[that.rowIndex]=false;
                that.missedQuestions.push(that.getQuestion());
            }
            view.showFeedback(false);
        }
    }, this.getQuestion=function(){
        //return new Question(this.ttr.base, this.rowIndex, this.ttr.valueAt(this.rowIndex));
        return that.questions[that.rowIndex];
    }, this.resetBase=function(event){
        that._hasQuestions=false;
        that.ttr=that.tt.rowAt(event.detail.newbase);
        that.rowIndex=0;
    }, this.showSetup=function(){
    	view.showSetup();
    }, this.toggleSetup=function(){
    	view.toggleSetup();
    }, this.getQuestions=function(config){
        var question, questions=[];
        // TODO we need to deal with config.base='random' here
        if(config.base=='random'){
            var tt=new Timestable(1, config.numberOfQuestions)
                , row=0
                , col=0
                , newq
                , alreadyExists=function(q){
                    for(var i=0, max=questions.length; i<max; i++)
                        if(questions[i].equals(q))
                            return true;
                    return false;
                };
            for(var i=1, max=config.numberOfQuestions; i<=max; i++){
                do{
                    row=Math.floor(Math.random()*config.numberOfQuestions)+1;
                    col=Math.floor(Math.random()*config.numberOfQuestions)+1;
                    newq=new Question(row, col, tt.valueAt(row,col));
// TODO do we worry about an infinite loop under certain conditions?
                }while(alreadyExists(newq));
                questions.push(newq);
            }
        }else{
            var ttrow=new TTRow(config.base);
            switch(config.order){
                case 'backward':
                    for(var i=config.numberOfQuestions; i>0; i--){
                        question=new Question(ttrow.base, i, ttrow.valueAt(i));
                        questions.push(question);
                    }
                    break;
                case 'random':
                    for(var i=1, max=config.numberOfQuestions; i<=max; i++){
                        question=new Question(ttrow.base, i, ttrow.valueAt(i));
                        questions.push(question);
                    }
                    var randomize=function(ar){
                        // Fisher-Yates algo
                        var index=ar.length, tmp, randIndex;
                        while(index!=0){
                            randIndex=Math.floor(Math.random()*index);
                            index-=1;
                            tmp=ar[index];
                            ar[index]=ar[randIndex];
                            ar[randIndex]=tmp;
                        }
                        return ar;
                    };
                    questions=randomize(questions);
                    break;
                case 'forward':
                default:
                    for(var i=1, max=config.numberOfQuestions; i<=max; i++){
                        question=new Question(ttrow.base, i, ttrow.valueAt(i));
                        questions.push(question);
                    }
                    break;
            }
        }
        return questions;
    }, this.setConfig=function(o){
        var newConfig=o;
        if(newConfig==undefined){
            newConfig=new Config();
            newConfig.readFromForm();
            if(newConfig.name!=undefined){
                config[newConfig.name]=newConfig;
                localStorage.config=JSON.stringify(config);
                that.view.updateConfigs();
            }
        }

        this.currConfig=newConfig;
        that.toggleSetup();
        that.questions=that.getQuestions(newConfig);
        view.showProgress(1, newConfig.numberOfQuestions);
        that.view.showQuestion(that.getQuestion(), this.currConfig.baseFirst);
        this.startTime=Date.now();
    }, this.removeConfig=function(configname){
        if(config.hasOwnProperty(configname)){
            delete config[configname];
            localStorage.config=JSON.stringify(config);
            that.view.updateConfigs();
        }
    };

    return this;
};
