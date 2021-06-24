<template>
  <div :style="bg">
 <!--    <img src="@/assets/game_image/book_bg.jpeg" class="image">-->
  <el-container style="height: 100%;flex-direction: column;">
 
      <h1>每日一答</h1>
    
    <div class="row">
            <el-col style="margin-bottom: -20px;color:#1b4965">
              <el-row class="num">
                 <el-form v-for="(item,index) in question1" :key="index" style="text-align:center;line-height: 30px; margin: 0 0.5%">
                     <el-form-item>
                      
                        <div class="round" :class="i===index?'active':''">{{index+1}}</div>
                        </el-form-item>
                        
                    </el-form>
                    </el-row>
                    <el-row class="title">
                       <div class="q-title">题目{{i+1}}：
                            <span v-html="question.title" class="q-item-span-content"></span>                 
                                                    </div>
                     
                        <!-- <div class="q-title">题目{{i+1}}：{{question.title}}</div>-->
                <div class="q-content">
                        <el-radio-group v-model="answer.content" @change="getRadioVal()" style=" display: flex;
      flex-direction: column;justify-content:center">
                        <el-radio  v-for="item in question.items"  :key="item.prefix"  :label="item.prefix"  style="margin: 4% 0;">
                            <span class="question-prefix">{{item.prefix}}.</span>
                            <span v-html="item.content" class="q-item-span-content"></span>
                        </el-radio>
                        </el-radio-group>
                    </div>
                      
                    </el-row>
                </el-col>
                <el-col>
                     <span class="do-exam-time">
                        <label>剩余时间：</label>
                        <label>{{remainTime}}秒</label>
                     </span>
                </el-col>
            
    </div>
  </el-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import gameApi from '@/api/game'
export default {
  
  data () {
    return {
      queryParam: {
        difficult:null,
        num:null,
        questionType:null,
        gradeLevel:1,
        subjectId: null,  
      },
        isActive:false,
      
      question:
          {     
          },
          question1:{},
          remainTime:15,
          i:0,
      answer:{
        content:''
      },
      score:0,
      timer:'',
       bg: {
          backgroundImage: "url(" + require("@/assets/game_image/book.png") + ") ",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          height:"100%",
          weight:"54%",
          margin:'0 auto'
        },

    }
  },
  created () {
    let _this = this
    this.loading = true
    
    let _i=this.$route.query.i;
   
    
    if(!_i){
      gameApi.tenQuestions(this.queryParam).then(re => {
      this.question1=re.response
      this.question=this.question1[0]
      sessionStorage.setItem('_question1', JSON.stringify(this.question1))
     // console.log(this.question1)
    })
      
    }

    this.timeReduce()
   

  },
  mounted(){
   let _this=this;
   /* this.timer=setInterval(function(){
                 _this.i++;
                 console.log(_this.i)
                 let _i=_this.i
                  _this.question=_this.question1[_i];
                  _this.remainTime=15  
                  
                 if(_this.i==10){
             this.$alert('您的得分为：'+this.score+'分', '得分', {
               dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
              callback: action => {
                 this.$router.push('/game/index')
                this.$message({
                  type: 'info',
                  message: `action: ${ action }`
                });
              }
             })
         
       }*/
     /*  this.timer=setTimeout(function(){
         _this.i++
         _this.$router.push({path:'/game/daily',query: {i: _this.i,question1:_this.question1}})
       },15000);*/
                
           
                 


 
  //this.change()
  },
  watch: {
     $route(to, from) {
   	//监听路由参数变化
      if (this.$route.query.i) {
       // 参数变化 复用 mounted里面的方法
       let _i=Number(this.$route.query.i);
       let _q=sessionStorage.getItem('_question1');
      
       let _question1=JSON.parse(_q)
        this.remainTime=15
        
      this.i=_i;
    this.answer.content=null
      
      this.question1=_question1;
      this.question=this.question1[_i]
      // console.log(this.question)
      // console.log(this.i)
      this.timeReduce()
      
      };
      if(this.i==10){
             this.$alert('您的得分为：'+this.score+'分', '得分', {
               dangerouslyUseHTMLString: true,
            confirmButtonText: '确定1',
              callback: action => {
                 this.$router.push('/game/index')
                this.$message({
                  type: 'info',
                  message: `action: ${ action }`
                });
              }
             })
           }
    },
    

  },
  beforeDestroy () {
   
    if(this.timer) {
        clearInterval(this.timer);
    }
},

 

  methods: {
    getRadioVal(value){
       
          if(this.answer.content==this.question.correct){
            this.score++;
                this.$message({
                message: '恭喜你，答案正确',
                type: 'success'
             });
          }else{
            this.$message.error('错了哦');
          }
          
          console.log(this.i)
           if(this.i==9){
             this.$alert('您的得分为：'+this.score+'分', '得分', {
               dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
              callback: action => {
                 this.$router.push('/game/index')
                this.$message({
                  type: 'info',
                  message: `action: ${ action }`
                });
              }
             })
            this.i=11
           }
           if(this.i<9){
              this.i++;
              //解决倒计时不断加快问题，在这里跳转之前清除计时器
               clearInterval(this.timer)
               this.timer=null;
          this.$router.push({path:'/game/daily',query: {i: this.i}})
           
           }
       
          
      },
    /* change(){
          let _this=this;
          //let _i=this.i;
          /*   for( let _i=0; _i < _this.question1.length; _i++){
               
                if(this.i==_i){
                  _i++
                }
             
                 setTimeout(()=>{
                  
                   if(this.i>=_i){
                     _i++;
                   }
                    console.log(this.i,_i)
                   console.log(this.i)
                      this.i=_i;
                       _this.question=_this.question1[_i];
                       this.remainTime=15    
                 },_i*15000)
                 }
     
                */
              
              /* if(this.answer.content!=undefined){
                
                 _this.i++
                 let _i=_this.i
                _this.question=_this.question1[_i];
                  _this.remainTime=15
                  _this.answer.content=null
               }
*/
        /*       var timer=setInterval(function(){
                 _this.i++;
                 console.log(_this.i)
                 let _i=_this.i
                  _this.question=_this.question1[_i];
                  _this.remainTime=15  
                  
                 
                if(_this.i>=10){
                      this.$once('hook:beforeDestroy', () => {            
                        clearInterval(timer);                                    
                    })                                
                  
                  }
                   if(_this.i==10){
                      _this.$router.push('/game/index')
                  }
               },15000)
               
               
            if(_this.i>=10){
                   this.$once('hook:beforeDestroy', () => {            
                        clearInterval(timer);                                    
                    })
                  }
            
      },*/
     /* setTime(){
        return setTimeout((j)=>{
                     
                     this.question=_this.question1[j];
                     this.remainTime=15
                 },15000)
      },
      */
      formatSeconds (theTime) {
      return formatSeconds(theTime)
    },
    timeReduce () {
      let _this = this
     _this.timer= setInterval(function () {
        if (_this.remainTime >0) {
          
          --_this.remainTime
        }else{
          window.clearInterval(_this.timer)
          
           if(_this.i<10){
              _this.i++
          _this.$router.push({path:'/game/daily',query: {i: _this.i}})
           
           }
          
        }
      }, 1000)
     
         _this.$once('hook:beforeDestroy', () => {
        clearInterval(_this.timer);
        _this.timer=null
      })
      
     
    },
    statusTagFormatter (status) {
      return this.enumFormat(this.statusTag, status)
    },
    statusTextFormatter (status) {
      return this.enumFormat(this.statusEnum, status)
    }
  },
  computed: {
    ...mapGetters('enumItem', [
      'enumFormat'
    ]),
    ...mapState('enumItem', {
      statusEnum: state => state.exam.examPaperAnswer.statusEnum,
      statusTag: state => state.exam.examPaperAnswer.statusTag
    })
  }
}
</script>

<style lang="scss" scoped>
  .index-title-h3 {
    font-size: 22px;
    font-weight: 400;
    color: #1f2f3d;
    border-left: solid 10px #2ce8b4;
    padding-left: 10px;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 50%;
    height: 80%;
    display: block;
    margin: 20px auto 10px auto;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .app-item-contain{
      display: flex;
      justify-content: center;
  }
  h3{
    text-align: center;
  }
.row{
  
   z-index:1;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
       margin: 0 auto auto;
   
}
.round{
    border: 2px solid #5fa8d379;
   width: 36px;
   
    height: 36px;
    border-radius: 50%;
    line-height: 36px;
    font-size: 20px;
    color: #1b4965;
    
}
.num{
    display: flex;
    justify-content: center;
    margin: 0 ;
}
.title{
   margin: 20px 0;
   height: 70%;
  
}
.q-title{
  font-size: 16px;
    color: #1b4965;
    font-weight: bold;
    width: 450px;
    word-break: break-all;


}
.el-radio{
      margin: 18px 0;
}
  .q-content{
     font-size: 20px;
  color: #1b4965;
  }
   .q-content span,.question-prefix{
     
      font-size: 16px;
    color: #1b4965;
    font-weight: normal !important;
    word-break: break-all;
   }
  .active{
      border: 1px solid #5fa8d3;
      background: #5fa8d3;
      color: white;
  }
  .correct{

  }
  .image{
     z-index:-1;
    position: absolute;
    width: 100%;
    margin: 0;
    
  }
  h1{
    text-align: center;
    
     -webkit-text-stroke: 1px #1b4965;  
     -webkit-text-fill-color: transparent;
    margin-top: 7%;
    font-size: 3em;
    margin-bottom: 1%;
     
  }
</style>
