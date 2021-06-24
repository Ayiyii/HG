<template>
  <div style="margin-top: 10px" class="contain">
    <el-row class="app-item-contain">
      
      <div style="padding-left: 15px">
          <el-card :body-style="{ padding: '0px' }" v-loading="loading">
            <img src="@/assets/game_image/g1logo.png" class="image">
            <div style="padding: 14px;">
              <h3>每日一题</h3>
              <div class="bottom clearfix">
                <router-link target="_blank" :to="{path:'/game/daily'}">
                  <el-button type="text" :style="but"></el-button>
                </router-link>
              </div>
            </div>
          </el-card>
      </div>
       <div style="padding-left: 15px">
          <el-card :body-style="{ padding: '0px' }" v-loading="loading">
            <img src="@/assets/game_image/g2logo.png" class="image">
            <div style="padding: 14px;">
              <h3>趣味闯关</h3>
              <div class="bottom clearfix">
                <router-link target="_blank" :to="{path:'/game/pass'}">
                
                  <el-button type="text" :style="but"></el-button>
                </router-link>
              </div>
            </div>
          </el-card>
      </div>
      <div style="padding-left: 15px">
          <el-card :body-style="{ padding: '0px' }" v-loading="loading">
            <img src="@/assets/game_image/g3logo.png" class="image">
            <div style="padding: 14px;">
              <h3>一站到底</h3>
              <div class="bottom clearfix">
                <router-link target="_blank" :to="{path:'/game/waiting'}">
                  <el-button type="text" :style="but"></el-button>
                </router-link>
              </div>
            </div>
          </el-card>
      </div>
    </el-row>
   
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import indexApi from '@/api/dashboard'
export default {
  data () {
    return {
      fixedPaper: [],
      timeLimitPaper: [],
      pushPaper: [],
      loading: false,
      taskLoading: false,
      taskList: [],
      items:['每日一题','趣味闯关','一站到底'],
       but: {
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
    let _this = this
    this.loading = true
    indexApi.index().then(re => {
      _this.fixedPaper = re.response.fixedPaper
      _this.timeLimitPaper = re.response.timeLimitPaper
      _this.pushPaper = re.response.pushPaper
      _this.loading = false
    })

    this.taskLoading = true
    indexApi.task().then(re => {
      _this.taskList = re.response
      _this.taskLoading = false
    })
  },
  methods: {
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
      width:100%;
      height: 100%;
      display: flex;
      justify-content: center;
  }
  h3{
    text-align: center;
    margin: 0px;
    margin-bottom: -16px;
    font-size: 24px;
     color: #1b4965;
    text-shadow: 0 0 0.2em #Cae9ff, 0 0 0.2em #Cae9ff,
        0 0 0.2em #Cae9ff
  }
</style>
