<template>
<div>
 <!-- <el-row  class="do-exam-title" style="background-color: #F5F5DC">
    <el-col :span="24">
        <span :key="index"  v-for="(answerItems,index) in answer.answerItems">
             <el-tag :type="questionDoRightTag(answerItems.doRight)" class="do-exam-title-tag" @click="goAnchor('#question-'+index)">{{index}}</el-tag>
        </span>
    </el-col>
  </el-row>-->
  <el-row  class="do-exam-title-hidden">
    <el-col :span="24">
        <span :key="item.itemOrder"  v-for="(item,index) in answer.answerItems">
             <el-tag  class="do-exam-title-tag" >{{index}}</el-tag>
        </span>
    </el-col>
  </el-row>
  <el-container  class="app-item-contain">
    <el-header class="align-center">
      <h1>{{form.name}}</h1>
      <div>
        <span class="question-title-padding">试卷得分：{{answer.score}}</span>
        <span class="question-title-padding">试卷耗时：{{formatSeconds(answer.doTime)}}</span>
      </div>
    </el-header>
    <el-main>
      <el-form :model="form" ref="form" v-loading="formLoading" label-width="100px">
        <el-row :key="index"  v-for="(titleItem,index) in form.titleItems">
          <h3>{{titleItem.name}}</h3>
          <el-card class="exampaper-item-box" v-if="titleItem.questionItems.length!==0">
            <el-form-item :key="qIndex" :label="qIndex+1+'.'"
                          v-for="(questionItem,qIndex) in titleItem.questionItems"
                          class="exam-question-item"  label-width="50px" :id="'question-'+ qIndex">
              <QuestionAnswerShow :qType="questionItem.questionType" :question="questionItem"  :answer="answer.answerItems[index]"/>
            </el-form-item>
             <el-form-item label="评语:" style="margin-top:20px">
              <el-input
  type="textarea"
 
  placeholder="请输入评语"
  v-model="answer.comment">
</el-input>
            </el-form-item>
          </el-card>
        </el-row>
         <el-row class="do-align-center">
         
          <router-link target="_blank" :to="{path:'/record/index'}">
                   <el-button >返回</el-button>
                </router-link>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { formatSeconds } from '@/utils'
import QuestionAnswerShow from '../components/QuestionAnswerShow'
import examPaperAnswerApi from '@/api/examPaperAnswer'
export default {
  components: { QuestionAnswerShow },
  data () {
    return {
      form: {},
      formLoading: false,
      answer: {
        id: null,
        score: 0,
        doTime: 0,
        answerItems: [],
        doRight: false
      }
    }
  },
  created () {
    let id = this.$route.query.id
    let _this = this
    if (id && parseInt(id) !== 0) {
      _this.formLoading = true
      examPaperAnswerApi.read(id).then(re => {
        _this.form = re.response.paper
        _this.answer = re.response.answer
        _this.formLoading = false
      })
    }
  },
  methods: {
    formatSeconds (theTime) {
      return formatSeconds(theTime)
    },
    questionDoRightTag (status) {
      return this.enumFormat(this.doRightTag, status)
    },
    goAnchor (selector) {
      console.log(selector)
      this.$el.querySelector(selector).scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' })
    }
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      doRightTag: state => state.exam.question.answer.doRightTag
    })
  }
}
</script>

<style lang="scss" scoped>
  .align-center {
    text-align: center
  }

  .exam-question-item{
    padding: 10px;
    .el-form-item__label{
      font-size: 15px !important;
    }
  }

  .question-title-padding{
    padding-left: 25px;
    padding-right: 25px;
  }
</style>
