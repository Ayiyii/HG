<template>
  <div>
    
    <el-row class="row">
      <el-row >
      <el-col :span="12" class="row1">
       <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        <span>当前得分：{{score}}</span>
      </el-col>
      <el-col :span="12" class="row1">
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        <span>当前得分：3</span>
      </el-col>
    </el-row>
            <el-col >
             <el-row class="num">
                 <el-form v-for="(item,index) in question1" :key="index" style="text-align:center;line-height: 30px;">
                     <el-form-item>
                        <div class="round" :class="i===index?'active':''">{{index+1}}</div>
                        </el-form-item>
                        
                    </el-form>
                    </el-row>
                    <el-row class="title">
                 
                         <div class="q-title">题目{{i+1}}：{{question.title}}</div>
                <div class="q-content">
                        <el-radio-group v-model="answer.content" @change="getRadioVal()" style=" display: flex;
      flex-direction: column;justify-content:center">
                        <el-radio  v-for="item in question.items"  :key="item.prefix"  :label="item.prefix" >
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
            
    </el-row>
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
       socket:null,
    
        toUserId:'2',
        content:'3',
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
      timer:''
    }
  },
  created () {
    console.log(this.user)
    this.openSocket()
    let _this = this
    this.loading = true
    
    let _i=this.$route.query.i;
   
    
    if(!_i){
      gameApi.tenQuestions(this.queryParam).then(re => {
      this.question1=re.response
      this.question=this.question1[0]
      sessionStorage.setItem('_question1', JSON.stringify(this.question1))
      
    })
      
    }
    this.timeReduce()

  },
  mounted(){
    
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
          this.$router.push({path:'/game/aganist',query: {i: this.i}})
           
           }
       
          
      },
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
          _this.$router.push({path:'/game/aganist',query: {i: _this.i}})
           
           }
          
        }
      }, 1000)
     
         _this.$once('hook:beforeDestroy', () => {
        clearInterval(_this.timer);
        _this.timer=null
      })
      
     
    },
    openSocket() {
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        console.log(this.userId)
        //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        //等同于socket = new WebSocket("ws://localhost:8888/xxxx/im/25");
        //var socketUrl="${request.contextPath}/im/"+$("#userId").val();
        var socketUrl =
          "http://47.97.152.219:8000/imserver/" + this.userId;
        socketUrl = socketUrl.replace("https", "ws").replace("http", "ws");
        console.log(socketUrl);
        if (this.socket != null) {
          this.socket.close();
          this.socket = null;
        }
        this.socket = new WebSocket(socketUrl);
        //打开事件
        this.socket = new WebSocket(socketUrl);
        //打开事件
        this.socket.onopen = function() {
          console.log("websocket已打开");
          //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        //获得消息事件
        this.socket.onmessage = function(msg) {
          console.log(msg.data);
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
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
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
             this.content +
            '"}'
         );
    
    }
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
    ...mapState('user', {
      userId: state => state.userId,
  
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
    border: 1px solid #979fa8;
    width: 60%;
   
    margin: auto;
}
.row1{
  display: flex;
  justify-content: center;
  margin: 30px 0;
  flex-direction: column;
  align-items: center;
}
.round{
    border: 1px solid #979fa8;
    width: 30px;
    height: 30px;
    border-radius: 50%;
}
.num{
    display: flex;
    justify-content: center;
}
.title{
   margin: 20px 10%;
}
  .q-content{
     
  }
 
  .box{
    background: rgb(231, 155, 100);
    width: 50px;
    height: 50px;
  }
  .box1{
    background: rgb(121, 179, 226);
    width: 50px;
    height: 50px;
  }
  .active{
      border: 1px solid #75a2d4;
      background: rgb(81, 118, 187);
      color: white;
  }
</style>
