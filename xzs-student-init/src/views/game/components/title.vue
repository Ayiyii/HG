<template>
<div>
     <div class="q-title">题目{{i+1}}：{{question.shortTitle}}</div>
                <div class="q-content">
                   
                        <el-radio-group v-model="answer.content" @change="getRadioVal(answer.content)" style=" display: flex;
      flex-direction: column;justify-content:center">
                        <el-radio  v-for="item in question.items"  :key="item.prefix"  :label="item.prefix" >
                            <span class="question-prefix">{{item.prefix}}.</span>
                            <span v-html="item.content" class="q-item-span-content"></span>
                        </el-radio>
                        </el-radio-group>
                    </div>
              </div>  
</template>
<script>
export default {
    name: 'Title',
    props:{
        question: {
      type: Object,
      default: function () {
        return {}
      }
    },
    answer: {
      type: Object,
      default: function () {
        return { id: null, content: '', contentArray: [], doRight: false }
      }
    },
    }
}
</script>