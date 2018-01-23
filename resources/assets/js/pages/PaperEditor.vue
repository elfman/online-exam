<template>
  <div class="wrapper">
    <el-form label-width="80px" :model="paper" :rules="rules" ref="form" v-loading="loading">
      <el-form-item label="标题" prop="title">
        <el-input v-model="paper.title"></el-input>
      </el-form-item>
      <el-form-item label="时间" prop="time_limit">
        <el-input v-model="paper.time_limit">
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item label="重考次数" prop="repeat_limit">
        <el-input v-model.number="paper.repeat_limit"></el-input>
      </el-form-item>
      <el-form-item label="" style="margin-bottom: 8px;">
        <el-checkbox v-model="paper.needPassword">是否需要密码</el-checkbox>
      </el-form-item>
      <el-form-item label="密码" v-if="paper.needPassword" prop="password">
        <el-input v-model="paper.password"></el-input>
      </el-form-item>
      <el-form-item label="" style="margin-bottom: 8px;">
        <el-checkbox v-model="paper.openLater">是否延时开启</el-checkbox>
      </el-form-item>
      <el-form-item label="开始时间" prop="open_time" v-if="paper.openLater">
        <el-date-picker
          v-model="paper.openTime"
          type="datetime"
          placeholder="请选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="" style="margin-bottom: 8px;">
        <el-checkbox v-model="paper.closeOnTime">是否定时关闭</el-checkbox>
      </el-form-item>
      <el-form-item label="结束时间" prop="close_time" v-if="paper.closeOnTime">
        <el-date-picker
          v-model="paper.closeTime"
          type="datetime"
          placeholder="请选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <div>
        <div v-for="(item, index) in paper.questions" :key="index" class="question">
          <question
            :question="item"
            :id="index"
            @save="onSaveQuestion"
            @remove="onRemoveQuestion"
            @up="onQuestionUp"
            @down="onQuestionDown"
          ></question>
        </div>
        <question
          v-if="addingQuestion"
          @create="onCreateQuestion"
          @cancel="onQuestionCancel"
          :edit="true"
        ></question>
        <el-form-item prop="questions">
          <el-button class="create" type="primary" icon="el-icon-circle-plus" @click="addQuestion">添加新题目</el-button>
        </el-form-item>
      </div>

      <hr>
      <el-row>
        <el-col :span="4" :offset="10">
          <el-button type="primary" size="large" @click="save">保存试卷</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import Question from '../components/Question.vue';

  export default {
    data() {
      const validateDigit = (rule, value, callback) => {
        const reg = /^[0-9]*[1-9][0-9]*$/;
        if (!reg.test(value)) {
          callback(new Error('请输入一个大于0的整数'));
        } else {
          callback();
        }
      };
      const validateQuestions = (rule, value, callback) => {
        if (this.paper.questions.length === 0) {
          callback(new Error('请输入至少一个题目'));
        } else {
          callback();
        }
      };

      const validatePassword = (rule, value, callback) => {
        if (this.paper.needPassword) {
          if (value && value.length > 0) {
            callback();
          } else {
            callback(new Error('请输入密码'));
          }
        }
      };

      const validateOpenTime = (rule, value, callback) => {
        if (this.paper.closeOnTime && this.paper.openLater) {
          if (new Date(this.paper.closeTime) - new Date(this.paper.openTime) <= 0) {
            callback(new Error('结束时间应该迟于开始时间'));
          }
        }
        this.$refs.form.validateField('close_time');
      };

      const validateCloseTime = (rule, value, callback) => {
        if (this.paper.closeOnTime && this.paper.openLater) {
          if (new Date(this.paper.closeTime) - new Date(this.paper.openTime) <= 0) {
            callback(new Error('结束时间应该迟于开始时间'));
          }
        }
        this.$refs.form.validateField('open_time');
      };
      const rules = {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        time_limit: [
          { required: true, message: '请输入考试时长', trigger: 'blur' },
          { validator: validateDigit, trigger: 'blur' },
        ],
        repeat_limit: [
          { required: true, message: '请输入最多能重复考试的次数', trigger: 'blur' },
          { validator: validateDigit, trigger: 'blur' },
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' },
        ],
        questions: [
          { validator: validateQuestions, trigger: 'submit' },
        ],
        open_time: [
          { validator: validateOpenTime, trigger: 'change' },
        ],
        close_time: [
          { validator: validateCloseTime, trigger: 'change' },
        ]
      };
      return {
        rules,
        paper: {
          needPassword: false,
          password: '',
          title: '',
          openLater: false,
          openTime: '',
          time_limit: 60,
          questions: [],
          answers: [],
          repeat_limit: 1,
          closeOnTime: false,
          closeTime: '',
        },
        addingQuestion: false,
        loading: false,
      }
    },
    methods: {
      loadPaper(id) {
        this.loading = true;
        axios.get(`/api/papers/${id}/edit`).then(res => {
          this.loading = false;
          const data = res.data;
          if (!data.errors) {
            const paper = data.paper;
            paper.questions = JSON.parse(paper.content);
            let answers = JSON.parse(paper.answers);
            paper.questions.forEach((item, index) => {
              item.answer = answers[index];
              item.title = item.question;
            });
            paper.needPassword = !!paper.password;
            paper.openLater = !!paper.open_time;
            paper.openTime = paper.open_time ? new Date(paper.open_time) : '';
            paper.closeOnTime = !!paper.close_time;
            paper.closeTime = paper.close_time ? new Date(paper.close_time) : '';
            this.paper = paper;
          }
        });
      },
      addQuestion() {
        this.addingQuestion = true;
      },
      onQuestionCancel() {
        this.addingQuestion = false;
      },
      onCreateQuestion(question) {
        this.paper.questions.push(question);
        this.addingQuestion = false;
        this.$refs.form.validateField('questions');
      },
      onSaveQuestion(id, question) {
        this.$set(this.paper.questions, id, question)
      },
      onRemoveQuestion(id) {
        this.paper.questions.splice(id, 1);
      },
      onQuestionUp(id) {
        if (id === 0) {
          return;
        }
        let questions = this.paper.questions;
        let temp = questions[id];
        this.$set(questions, id, questions[id - 1]);
        this.$set(questions, id - 1, temp);
      },
      onQuestionDown(id) {
        let questions = this.paper.questions;
        if (id === questions.length - 1) {
          return;
        }
        let temp = questions[id];
        this.$set(questions, id, questions[id + 1]);
        this.$set(questions, id + 1, temp);
      },
      save() {
        let url = this.paper.id ? `/api/papers/${this.paper.id}/update` : '/api/papers/store';
        let answers = [];
        this.$refs.form.validate(valid => {
          if (valid) {
            let questions = this.paper.questions.map((item) => {
              answers.push(item.answer);
              return {
                question: item.title,
                type: item.type,
                score: item.score,
                options: item.options,
              }
            });
            axios.post(url, {
              title: this.paper.title,
              time_limit: this.paper.time_limit,
              need_password: this.paper.needPassword,
              password: this.paper.needPassword ? this.paper.password : undefined,
              open_later: this.paper.openLater,
              open_time: this.paper.openLater ? this.paper.openTime : undefined,
              repeat_limit: this.paper.repeat_limit,
              close_on_time: this.paper.closeOnTime,
              close_time: this.paper.closeOnTime ? this.paper.closeTime : undefined,
              questions,
              answers,
            }).then(response => {
              if (!response.data.errors) {
                this.$message({
                  message: this.paper.id ? '保存成功' : '创建成功',
                  type: 'success',
                });
              } else {
                this.$message({
                  message: this.paper.id ? '保存失败' : '创建失败',
                  type: 'error',
                });
              }
            });
          }
        });
      }
    },
    created() {
      if (this.$route.name === 'editPaper') {
        const id = this.$route.params.id;
        this.loadPaper(id);
      }
    },
    watch: {
      '$route': function (val) {
        this.addingQuestion = false;
        if (this.$route.name === 'createPaper') {
          this.paper = {
            title: '',
            time_limit: 60,
            questions: [],
            answers: [],
          };
        } else if (this.$route.name === 'editPaper') {
          const id = /papers\/(\d+)\/edit/.exec(val.path)[1];
          this.loadPaper(id);
        }
      }
    },
    components: {
      question: Question,
    }
  }
</script>

<style lang="scss" scoped>
  label.el-radio, label.el-checkbox {
    display: block;
    margin-left: 0 !important;
    line-height: 16px;
    &:not(:first-child) {
      margin-top: 10px;
    }
  }

  .question {
    margin-bottom: 16px;
  }

  .create {
    margin-top: 12px;
  }
</style>