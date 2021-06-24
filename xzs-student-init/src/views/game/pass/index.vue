<template>
  <div>
     <el-row class="row">
    <el-form v-for="(item,index) in checkpoint" :key="index" >
      
         <el-form-item>
                       
                       
        <div style="padding-left: 15px">
          <el-card :body-style="{ padding: '0px'}" v-loading="loading">
            <img v-if='item.lock==1' src="@/assets/game_image/unlock.png" class="image">
            <img v-if='item.lock==0' src="@/assets/game_image/lock.png" class="image" @click="open1">
            <div style="">
              <div class='htitle'>第{{index+1}}关<br>难度系数{{item.difficult}}<br>{{item.num}}</div>
              <div class="bottom clearfix">
            <!--    <el-button  v-if="item.lock" type="text" class="button"  @click="open1">未解锁</el-button>-->
              
                <router-link  v-if='item.lock==1' target="_blank" :to="{path:'/game/passPage',query: {difficult: item.difficult,num:item.num,degree:item.index}}">
                  <el-button type="text" :style="but" ></el-button>
                </router-link>
              </div>
            </div>
          </el-card>
      </div>
      
        </el-form-item>
       
  </el-form>
    </el-row>
   <!-- <el-row class="row">
      <el-col :span="8">
        <div style="padding-left: 15px">
          <el-card :body-style="{ padding: '0px' }" v-loading="loading">
            <img src="@/assets/exam-paper/show1.png" class="image">
            <div style="padding: 14px;">
              <h3>第一关<br>难度系数5</h3>
              <div class="bottom clearfix">
                
                <router-link target="_blank" :to="{path:'/game/passPage'}">
                  <el-button type="text" class="button" >开始游戏</el-button>
                </router-link>
              </div>
            </div>
          </el-card>
      </div>
      </el-col>
      <el-col :span="8">
      <div style="padding-left: 15px">
          <el-card :body-style="{ padding: '0px' }" v-loading="loading">
            <img src="@/assets/exam-paper/show1.png" class="image">
            <div style="padding: 14px;">
              <h3>第二关<br>难度系数10</h3>
              <div class="bottom clearfix">
                 <el-button type="text" class="button" @click="centerDialogVisible1 = true">开始游戏</el-button>
                <router-link target="_blank" :to="{path:'/game/daily'}">
                 
                </router-link>
              </div>
            </div>
          </el-card>
      </div>
      </el-col>
      <el-col :span="8">
      <div style="padding-left: 15px">
          <el-card :body-style="{ padding: '0px' }" v-loading="loading">
            <img src="@/assets/exam-paper/show1.png" class="image">
            <div style="padding: 14px;">
              <h3>第三关<br>难度系数15</h3>
              <div class="bottom clearfix">
                <el-button type="text" class="button"  @click="open1">未解锁</el-button>
                <router-link target="_blank" >
                  
                </router-link>
              </div>
            </div>
          </el-card>
      </div>
      </el-col>
           
            
    </el-row>
   -->
  </div>
  
</template>

<script>
import { mapState, mapGetters,mapMutations } from 'vuex'
import gameApi from '@/api/game'

import indexApi from '@/api/dashboard'
export default {
  data () {
    return {
      checkpoint:[{
        index:1,
        degree:'',
        star:'',
        lock:false,
        score:'',
        difficult:1,
        num:3,
      },
      {
        index:2,
        degree:'',
        star:'',
        lock:false,
        score:'',
        difficult:1,
        num:4,
      },
       {
        index:2,
        degree:'',
        star:'',
        lock:false,
        score:'',
        difficult:1,
        num:4,
      },
       
   
      
    
      ],
        isActive:false,
        count:0,
        loading:false,
      answer:{},
       but: {
          backgroundImage: "url(" + require("@/assets/game_image/start.jpeg") + ") ",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
         
          width: "100%",
        height:"70px" 
        },
        but1: {
          backgroundImage: "url(" + require("@/assets/game_image/start.jpeg") + ") ",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
         
          width: "100%",
        height:"70px" 
        },
    }
  },
  created () {
    this.loading = false
    let _this = this
    
     gameApi.getPass(3).then(re => {
       let _re=re.response;
        this.checkpoint[0].lock=re.response.one
        this.checkpoint[1].lock=re.response.two
        this.checkpoint[2].lock=re.response.three
        this.checkpoint[3].lock=re.response.four
        this.checkpoint[4].lock=re.response.five
       console.log(_re)
     })
   
   
    this.isAdd()

    console.log(this.point)
  },
  watch: {
    checkpoint:{
       handler: function () {
        this.isAdd()
       },
        deep: true
    }
    
    
  },
  methods: {
    isAdd(){
      
      let len=this.checkpoint.length;
      console.log(len)
      this.checkpoint.forEach(item=>{
        
        if(item.lock==true){
          this.count++;
        }
      })
      let _difficult,_num;
      if(this.count<=1){
        switch(true){
          case (len<5):
            _difficult=1;
            _num=this.checkpoint[len-1].num+1;
            break;
          case (len<10):
            _difficult=2;
            _num=this.checkpoint[len-1].num+1;
            break;
          case (len<15):
            _difficult=3;
            _num=this.checkpoint[len-1].num+1;
            break;
          case (len<20):
            _difficult=4;
            _num=this.checkpoint[len-1].num+1;
            break;
          default:
            _difficult=5;
            _num=this.checkpoint[len-1].num+1;
            break;
          
        }
        this.checkpoint.push({
        index:len,
        degree:'',
        star:'',
        lock:true,
        score:'',
        difficult:_difficult,
        num:_num
      })
      }
      //vuex如果分为几个模块，方法是在模块中的话，如果直接在组件中通过this.$store.commit("方法名")是获取不到，必须要在前面加上模块名，如this.$store.commit("模块名/方法名")才可以获取到
     this.$store.dispatch('changeValue',this.checkpoint)
    },
     
      open1(){
        this.$message({
          showClose: true,
          message: '该关卡还未解锁！',
          type: 'warning'
        });
      },
      formatSeconds (theTime) {
      return formatSeconds(theTime)
    },
    
    statusTagFormatter (status) {
      return this.enumFormat(this.statusTag, status)
    },
    statusTextFormatter (status) {
      return this.enumFormat(this.statusEnum, status)
    },
    ...mapMutations('this.checkpoint', ['changeValue'])
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
  .htitle{
    text-align: center;
        margin: 0;
        line-height: 25px;
    font-size: 16px;
    color: #1b4965;
  }
.row{
   display: flex;
    flex-wrap: wrap;
    margin: 10px;
    margin-top: 20px;
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
  .active{
      border: 1px solid #75a2d4;
  }
</style>
