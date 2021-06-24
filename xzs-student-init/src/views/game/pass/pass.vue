<template>
  <div :style="bg">
     <el-container style="height: 100%;flex-direction: column;">
      <h2>趣味闯关：第{{degree}}关</h2>
    <el-row class="row">
            <el-col >
              <el-row class="num">
                 <el-form v-for="(item,index) in question1" :key="index" style="text-align:center;line-height: 30px;">
                     <el-form-item>
                        <div class="round" :class="i===index?'active':''">{{index+1}}</div>
                        </el-form-item>
                        
                    </el-form>
                    </el-row>
                    <el-row class="title">
                 
                         <div class="q-title">题目{{i+1}}：
                            <span v-html="question.title" class="q-item-span-content"></span>                 
                                                    </div>
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
               
            
    </el-row>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapGetters ,mapMutations} from 'vuex'
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
      fixedPaper: [],
      timeLimitPaper: [],
      pushPaper: [],
      loading: false,
      taskLoading: false,
      taskList: [],
      items:['每日一题','趣味闯关','一站到底'],
      question:
          {
      
          },
      question1:
          [
           
          ],
          remainTime:15,
          i:0,
      answer:{
        content:''
      },
      score:0,
      timer:'',
      degree:'',
       bg: {
          backgroundImage: "url(" + require("@/assets/game_image/book.png") + ") ",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          height:"100%",
          weight:"54%",
          margin:'0 auto'
        },
        degrees:'',
        match:{
          '1':'one',
          '2':'two',
          '3':'three',
          '4':'four',
          '5':'five'
        }

    }
  },
  created () {
    let _this = this
    this.loading = true
    this.queryParam.difficult=this.$route.query.difficult;
   this.queryParam.num=this.$route.query.num;
   this.degree=this.$route.query.degree;
  
      gameApi.pass(this.queryParam).then(re => {
      this.question1=re.response
      this.question=this.question1[0]
     
      })
       gameApi.getPass(3).then(re => {
       let _re=re.response;
       this.degrees=_re
      
     })
   
    
 console.log(this.point)
  },
  watch: {
   /*  $route(to, from) {
   	//监听路由参数变化
      if (this.$route.query.num) {
       // 参数变化 复用 mounted里面的方法
       this.queryParam.difficult=this.$route.query.difficult;
      this.queryParam.num=this.$route.query.num;
  
      gameApi.pass(this.queryParam).then(re => {
      this.question1=re.response
      this.question=this.question1[0]
     
      })
      }
     }*/
  },
  mounted(){
   let _this=this;
   
 
  //this.change()
  },
 

  methods: {
    getRadioVal(value){
      let _this=this
       
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
           
           if(this.i==this.queryParam.num-1){

            if(this.score==this.queryParam.num){
              let t=parseInt(this.degree)+1;
              let a=this.match[t]
              
              this.degrees[a]=1;
              gameApi.updatePass(this.degrees).then(re => {
                  console.log('sucess')
                })
            }
             // console.log(this.point)
          //   this.$store.commit('game/score',_i,this.score)
            // console.log(this.point)

             this.$alert('您的得分为：'+_this.score+'分', '得分', {
               dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
              callback: action => {
                 this.$router.push('/game/pass')
                this.$message({
                  type: 'info',
                  message: `action: ${ action }`
                });
              }
             })
         
       } 
       if(this.i<this.queryParam.num-1){
         this.i++
           this.answer.content=null
         this.question=this.question1[this.i]
       }
          return true;
      },
    
     
      formatSeconds (theTime) {
      return formatSeconds(theTime)
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
     ...mapState('game', {
      point: state => state.point,
      
    }),
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
    
}
.round{
    border: 1px solid #979fa8;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    line-height: 30px;
}
.num{
    display: flex;
    justify-content: center;
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
  .active{
      border: 1px solid #75a2d4;
      background: rgb(81, 118, 187);
      color: white;
  }
  .correct{

  }
  h2{
     text-align: center;
    
     -webkit-text-stroke: 1px #1b4965;  
     -webkit-text-fill-color: transparent;
    margin-top: 7%;
    font-size: 3em;
    margin-bottom: 1%;
  }
  .row{
  
   z-index:1;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
       margin: 0 auto auto;
   
}
</style>
