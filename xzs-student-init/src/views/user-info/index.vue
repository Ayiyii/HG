<template>
  <div style="margin-top: 10px" class="app-contain">
    <el-row :gutter="50">
      <el-col :span="7">
        <el-card>
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <el-row style="text-align: center">
            <el-upload action="/api/student/upload/image" name="multipartFile" accept=".jpg,.png" :show-file-list="false"  :on-success="uploadSuccess">
              <el-avatar class="el-dropdown-avatar" :size="100" :src="path === null ? require('@/assets/avatar.png') : path"></el-avatar>
            </el-upload>
          </el-row>
          <el-row class="user-info-userName">
            <label>{{form.userName}}</label>
          </el-row>
          <el-divider/>
          <el-row class="user-info-fullInfo">
            <label>姓名：{{form.realName}}</label><br/>
            <label>年级：{{levelFormatter(form.userLevel)}}</label><br/>
            <label>注册时间：{{form.createTime}}</label><br/>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="17">
        <el-card shadow="hover">
          <el-tabs active-name="event" type="card">
            <el-tab-pane label="用户动态" name="event">
              <div class="block">
                <el-timeline>
                  <el-timeline-item  :timestamp="item.createTime" placement="top" :key="item.id" v-for="item in event">
                    <el-card>
                      <p>{{item.content}}</p>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-tab-pane>
            <el-tab-pane label="个人资料修改" name="update">
              <el-form :model="form" ref="form" label-width="100px" v-loading="formLoading" :rules="rules">
                <el-form-item label="真实姓名：" prop="realName" required>
                  <el-input v-model="form.realName"></el-input>
                </el-form-item>
                <el-form-item label="年龄：">
                  <el-input v-model="form.age"></el-input>
                </el-form-item>
                <el-form-item label="性别：">
                  <el-select v-model="form.sex" placeholder="性别" clearable>
                    <el-option v-for="item in sexEnum" :key="item.key" :value="item.key"
                               :label="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="出生日期：">
                  <el-date-picker v-model="form.birthDay" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"/>
                </el-form-item>
                <el-form-item label="手机：">
                  <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="年级：" prop="userLevel" required>
                  <el-select v-model="form.userLevel" placeholder="年级">
                    <el-option v-for="item in levelEnum" :key="item.key" :value="item.key"
                               :label="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm">更新</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userApi from '@/api/user'
import { mapGetters, mapState,mapMutations } from 'vuex'

export default {
  data () {
    return {
      event: [],
      form: {
        userName: '',
        realName: '',
        age: '',
        sex: '',
        birthDay: null,
        phone: null,
        userLevel: null,
        createTime: null,
        imagePath: null
      },
      formLoading: false,
      path:'',
      rules: {
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        userLevel: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    let _this = this
  //  this.path='http://49.235.54.84:8000'+this.form.imagePath
    
    userApi.getUserEvent().then(re => {
      _this.event = re.response
    })
    userApi.getCurrentUser().then(re => {
      _this.form = re.response
      console.log(_this.form)
     // _this.setUserId(_this.form.id)
      //解决头像更新
      
      _this.path='http://47.97.152.219:8000'+re.response.imagePath
       _this.setImagePath(_this.path)
    })
    console.log(this.path)
  },
  methods: {
    uploadSuccess (re, multipartFile) {
      if (re.code === 1) {
        let path=re.response
        this.$set(this.form,'imagePath',path)
       // Vue.set(vm.form,'imagePath','path')
       //直接修改对象里面的imagePath无法显示头像
       this.path = 'http://47.97.152.219:8000'+re.response
        this.submitForm()
      } else {
        this.$message.error(re.message)
      }
      console.log(re.response)
      
      console.log(this.form.imagePath)
      
    },
    submitForm () {
      let _this = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true
          userApi.update(this.form).then(data => {
            if (data.code === 1) {
              
              _this.$message.success(data.message)
            } else {
              _this.$message.error(data.message)
            }
            _this.formLoading = false
          }).catch(e => {
            _this.formLoading = false
          })
        } else {
          return false
        }
      })
    },
    levelFormatter (level) {
      return this.enumFormat(this.levelEnum, level)
    },
     ...mapMutations('user', ['setUserId','setImagePath'])
  },
  computed: {
    ...mapGetters('enumItem', [
      'enumFormat'
    ]),
    ...mapState('enumItem', {
      sexEnum: state => state.user.sexEnum,
      levelEnum: state => state.user.levelEnum
    }),
   
  }
}
</script>

<style lang="scss" scoped>

</style>
