var Ctrl=function(view){
    var that=this;
    this.user='User'
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
            view.showFeedback(true, that.rowIndex, 13, that.getQuestion(), (that.rowIndex>that.currConfig.numberOfQuestions-1)?true:false);
        }else{
            if(!result.hasOwnProperty(that.rowIndex))
                result[that.rowIndex]=false;
            view.showFeedback(false);
        }
    }, this.getQuestion=function(){
        //return new Question(this.ttr.base, this.rowIndex, this.ttr.valueAt(this.rowIndex));
        return that.questions[that.rowIndex];
    }, this.resetBase=function(event){
        that._hasQuestions=false;
        that.ttr=that.tt.rowAt(event.detail.newbase);
        that.rowIndex=0;
/*                view.showProgress(1,13);
        that.toggleSetup();
        that.view.showQuestion(that.getQuestion());*/
    }, this.showSetup=function(){
    	view.showSetup();
    }, this.toggleSetup=function(){
    	view.toggleSetup();
    }, this.getQuestions=function(config){
        var question, questions=[];
        var ttrow=new TTRow(config.base);
        switch(config.order){
            case 'backward':
                for(var i=config.numberOfQuestions; i>0; i--){
                    question=new Question(ttrow.base, i, ttrow.valueAt(i));
                    questions.push(question);
                }
                break;
            case 'random':
                break;
            case 'forward':
            default:
                for(var i=1, max=config.numberOfQuestions; i<=max; i++){
                    question=new Question(ttrow.base, i, ttrow.valueAt(i));
                    questions.push(question);
                }
                break;
        }

        return questions;
    }, this.setConfig=function(){
        var newConfig=new Config();
        newConfig.readFromForm();
        if(newConfig.name!=undefined){
            config[newConfig.name]=newConfig;
            localStorage.config=JSON.stringify(config);
        }
        this.currConfig=newConfig;
        that.toggleSetup();
        view.showProgress(1, newConfig.numberOfQuestions);
        that.questions=that.getQuestions(newConfig);
        that.view.showQuestion(that.getQuestion());
    }
    ;

    return this;
};