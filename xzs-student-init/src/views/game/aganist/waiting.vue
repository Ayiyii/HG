<template>
  <div :style="bg">
    
    <el-row class="row2">
      <el-col :span="12" class="row1">
        <div>
      <el-avatar :src="imagePath === null ? require('@/assets/avatar.png') : imagePath"></el-avatar>
    </div>
        <span>当前得分：{{score}}</span>
      <!--  <el-button type="primary"  @click="answerMess">匹配对手</el-button>-->
      </el-col>
      <el-col :span="12" class="row3">
       <div>
      <el-avatar :src="toImagePath === null ? require('@/assets/avatar.png') : toImagePath"></el-avatar>
    </div>
        <span>当前得分：{{toScore}}</span>
      </el-col>
    </el-row>

     <el-row class="row" v-if="start">
            <el-col >
             <el-row class="num">
                 <el-form v-for="(item,index) in question1" :key="index" style="text-align:center;line-height: 30px;">
                  <!--   <el-form-item>
                        <div class="round" :class="i===index?'active':''">{{index+1}}</div>
                        </el-form-item>
                        -->
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
                        <el-radio  v-for="item in question.items"  :key="item.prefix"  :label="item.prefix" :disabled="isDisabled">
                            <span class="question-prefix">{{item.prefix}}.</span>
                            <span v-html="item.content" class="q-item-span-content"></span>
                        </el-radio>
                        </el-radio-group>
                    </div>
                      
                    </el-row>
                </el-col>
              <!--  <el-col>
                     <span class="do-exam-time">
                        <label>剩余时间：</label>
                        <label>{{remainTime}}秒</label>
                     </span>
                </el-col>-->
            
    </el-row>
    </div>
      
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import gameApi from '@/api/game'
import userApi from '@/api/user'

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
       socket:null,
      userId:'',
        toUserId:'',
        imagePath:'',
        toImagePath:'',
        content:'3',
        isActive:false,
      question:{},
          question1:{},
          remainTime:15,
          i:0,
      answer:{
        content:''
      },
      score:0,
      toScore:0,
      timer:'',
      start:false,
      startSend:false,
      fullscreenLoading: '',
      isDisabled:false,
      result:'',
       bg: {
          backgroundImage: "url(" + require("@/assets/game_image/book1.png") + ") ",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          height:"100%",
          weight:"54%",
          margin:'0 auto'
        },
        match:false,
    }
  },
  created () {
     
   this.init()
   console.log(this.toUserId)
   // this.sendMessage()
   this.fullscreenLoading=this.$loading({
          lock: true,
          text: '匹配对手中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
    
  
  },
  
   watch: {
     toUserId:function(val,oldVal){
      console.log(val)
      //this.start=true
     
      if(val){
        gameApi.rivalAvatar(this.toUserId).then(res=>{
           // console.log(res);
             this.imagePath='http://47.97.152.219:8000'+res.response[0]
            this.toImagePath='http://47.97.152.219:8000'+res.response[1];
           // console.log(this.toImagePath);
          })
      }
       this.fullscreenLoading.close();
       this.start=true;
    },
    i(val){
      if(val){
        console.log(val)
        this.question=this.question1[val]
      }
    },
    startSend(val){
      if(val){
        console.log(val)
        this.sendMessage()
      }
    },
    isDisabled(val){
      if(val==true){
        console.log(val)
        this.$message({
          message: '对手已抢先答题，您不能答题了哦',
          type: 'warning'
        });
        this.getAnswerMess()
        this.i++;
        this.isDisabled=false;
        this.answer.content='';
      }
     
    },
     match(val){
       if(val==true){
         gameApi.tenQuestions(this.queryParam).then(re => {
           console.log('sucess')
      this.question1=re.response
      this.question=this.question1[0]
      sessionStorage.setItem('_question1', JSON.stringify(this.question1))
    })
    this.sendMessage();
       }
      },
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
   this.socket.close()
     this.socket.onclose = function() {
          console.log("websocket已关闭");
        };
  },
  destroyed () {
    
  },
  methods: {
    async init(){
      let _this = this
    await userApi.getCurrentUser().then(re => {
       _this.userId = re.response.id
      
      // console.log(this.userId)
      
   
   })
    await this.openSocket();
    await this.sendMessage();
    },
     
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
          let _this=this;
          console.log(this.i)
           if(this.i==9){
             this.endMess();
           /*  this.$alert('您的得分为：'+this.score+'分', '得分', {
               dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
              callback: action => {
               this.$router.push('/game/index')
                this.$message({
                  type: 'info',
                  message: `action: ${ action }`
                });
              }
             })*/
             if(_this.score>_this.toScore){
                  _this.result='你赢啦'
                }else if(_this.score<_this.toScore){
                  _this.result='一不小心输了哟'
                }else{
                  _this.result='平局'
                }
                _this.$alert(_this.result, '游戏结束', {
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
          
           }
           if(this.i<9){
             // this.i++;
              this.answerMess()
              //解决倒计时不断加快问题，在这里跳转之前清除计时器
              // clearInterval(this.timer)
              // this.timer=null;
        /*  this.$router.push({path:'/game/aganist',query: {i: this.i}})*/
           
           }
       
          
      },
      formatSeconds (theTime) {
      return formatSeconds(theTime)
    },
   
    openSocket() {
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
     //   console.log(this.userId)
        //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        //等同于socket = new WebSocket("ws://localhost:8888/xxxx/im/25");
        //var socketUrl="${request.contextPath}/im/"+$("#userId").val();
        var socketUrl =
          "http://47.97.152.219:8000/imserver/" + this.userId;
        socketUrl = socketUrl.replace("https", "ws").replace("http", "ws");
      //  console.log(socketUrl);
        if (this.socket != null) {
          this.socket.close();
          this.socket = null;
        }
        this.socket = new WebSocket(socketUrl);
        //打开事件
        
        this.socket.onopen = function() {
          console.log("websocket已打开");
        //  this.socket.send("这是来自客户端的消息" + this.userId);
        };
        //获得消息事件
        let _this=this;
       this.socket.onmessage = function(msg) {
         console.log(msg.data);
     
         if(msg.data.indexOf('1matched')!=-1){
              _this.match=true;
          //  _this.sendMessage();
          }
          if(msg.data.indexOf('连接成功!')!=-1){
              _this.startSend=true;
          //  _this.sendMessage();
          }
          let tmp=parseInt(msg.data)
               if( Number.isNaN(tmp)==false){
                 
                 _this.toUserId=parseInt(msg.data);
               }
               //对方已答题
                if(msg.data.indexOf('next')!=-1){
                _this.isDisabled=true;
                let data=msg.data;
                //{"fromUserId":"3","contentText":"next 0","toUserId":"4"}
                //计算对手分数
                let s=data.split(' ')[1];
                let ss=s.split('"');
                let score=ss[0];
                _this.toScore=score;
                console.log(_this.toScore)
         
            }
            //跳到下一题
                if(msg.data.indexOf('add')!=-1){
                _this.i++;
                  _this.answer.content='';
         
                }
                //最后一题
                 if(msg.data.indexOf('end')!=-1){
                //_this.isDisabled=true;
                let data=msg.data;
                //{"fromUserId":"3","contentText":"next 0","toUserId":"4"}
                //计算对手分数
                let s=data.split(' ')[1];
                let ss=s.split('"');
                let score=ss[0];
                _this.toScore=score;
                console.log(_this.toScore)
                _this.$message({
                  message: '对手已抢先答题，游戏结束',
                  type: 'warning'
                });
                if(_this.score>_this.toScore){
                  _this.result='你赢啦'
                }else if(_this.score<_this.toScore){
                  _this.result='一不小心输了哟'
                }else{
                  _this.result='平局'
                }
                _this.$alert(_this.result, '游戏结束', {
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
            }
          //发现消息进入    开始处理前端触发逻辑
        };
        //关闭事件
         this.socket.onclose = function() {
                console.log("websocket已关闭");
            };
       
        //发生了错误事件
        this.socket.onerror = function() {
          console.log("websocket发生了错误");
        };
      }
    },
   sendMessage() {
      let _this=this;
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
      //  console.log('{"herId":"'+'kk'+'"}');
        //websocket通信failed to execute 'send'问题的解决,添加对状态的判断，在状态为OPEN时，执行send方法即可
       if(this.socket.readyState===1){
           _this.socket.send('{"herId":"'+'kk'+'"}');
           let question=JSON.stringify(this.question1);
            _this.socket.send( '{"toUserId":"' +
             this.toUserId +
            '","contentText":"' +
              " "+question+
            '"}');
        
         /*    _this.socket.onmessage = function(msg) {
               //注意this指向，用watch监听
               console.log(msg.data)
               let tmp=parseInt(msg.data)
               if( Number.isNaN(tmp)==false){
                 
                 _this.toUserId=parseInt(msg.data);
               }
            
       }
       */
         
          
          //发现消息进入    开始处理前端触发逻辑
        };
     
        };
         
   },
   answerMess(){
     let _this=this;
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
       // console.log('{"herId":"'+'kk'+'"}');
        //websocket通信failed to execute 'send'问题的解决,添加对状态的判断，在状态为OPEN时，执行send方法即可
        let _this=this
       if(this.socket.readyState===1){
           console.log(
          '{"toUserId":"' +
             this.toUserId +
            '","contentText":"' +
             "next" +this.score+
            '"}'
        );
        this.socket.send(
         '{"toUserId":"' +
             this.toUserId +
            '","contentText":"' +
             "next" +" "+this.score+
            '"}'
         );
        /*  _this.socket.onmessage = function(msg) {
               //注意this指向，用watch监听
               console.log(msg.data)
                if(msg.data.indexOf('next')!=-1){
                _this.isDisabled=true;
         
            }
          }*/
     

         
          
          //发现消息进入    开始处理前端触发逻辑
        };
     
        };
   },
    getAnswerMess(){
     let _this=this;
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
       // console.log('{"herId":"'+'kk'+'"}');
        //websocket通信failed to execute 'send'问题的解决,添加对状态的判断，在状态为OPEN时，执行send方法即可
        let _this=this
       if(this.socket.readyState===1){
           console.log(
          '{"toUserId":"' +
             this.toUserId +
            '","contentText":"' +
             "add" +
            '"}'
        );
        this.socket.send(
         '{"toUserId":"' +
             this.toUserId +
            '","contentText":"' +
             "add" +
            '"}'
         );
        /*  _this.socket.onmessage = function(msg) {
               //注意this指向，用watch监听
               console.log(msg.data)
                if(msg.data.indexOf('add')!=-1){
                _this.i++
         
            }
          }*/
     

         
          
          //发现消息进入    开始处理前端触发逻辑
        };
     
        };
   },
   endMess(){
      if(this.socket.readyState===1){
           console.log(
          '{"toUserId":"' +
             this.toUserId +
            '","contentText":"' +
             this.content +
            '"}'
        );
        this.socket.send(
         '{"toUserId":"' +
             this.toUserId +
            '","contentText":"' +
             "end" +" "+this.score+
            '"}'
         );
      }
   },
   
    closeSocket(){
      this.socket.close()
       this.socket.onclose = function() {
          console.log("websocket已关闭");
        };
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
    }),
   
  }
}
</script>
<style>
.row1{
      padding-left: 30%;
      margin-top: 20px;
          text-align: center;
}
.row3{
      padding-right: 30%;
      margin-top: 20px;
      text-align: center;
}
.el-avatar--circle {
    border-radius: 50%;
    width: 60px !important;
    height: 60px !important;
}
.row{
  color:#1b4965;
    z-index:1;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
       margin: 50px auto auto;
    width: 40%;
   
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
     
      font-size: 16px;
    color: #1b4965;
    font-weight: normal !important;
    word-break: break-all;
  }

</style>