<template>
  <div class="container" v-loading="loadingPaper">
    <div class="start-test" v-if="!paper">
      <el-alert type="error" :title="errorMessage" v-if="errorMessage" @close="errorMessage = null"></el-alert>
      <div class="checking-status" v-if="checkingStatus"><h3>正在获取...</h3></div>
      <template v-else>
        <div class="has-score" v-if="testStatus === 3">
          <p>你已经参加过此次测试，你的分数是 <strong>{{ lastScore }}</strong> 分</p>
          <p>是否重新测试？</p>
        </div>
        <div class="need-password" v-if="testStatus === 4">
          <p>该试卷需要密码才能访问</p>
          <el-input size="small" style="width: 200px;" placeholder="请输入密码" v-model="password"></el-input>
        </div>
        <div class="wait-for-open" v-if="testStatus === 5">
          <p>测试尚未开启，请耐心等待...</p>
          <div class="count-down">{{ leftTime }}</div>
        </div>
        <div class="times-limit" v-if="testStatus === 6">
          <p>你的参与次数已达上限，不能再参加此次考试！</p>
        </div>
        <el-button type="primary" @click="startTest" size="large" v-if="testStatus === 0 || testStatus === 3 || testStatus === 4">开始测试</el-button>
      </template>
    </div>
    <el-form v-if="paper" class="paper" ref="form">
      <div class="paper-header">
        <div class="title">{{ paper.title }}</div>
        <div class="subtitle">总分：{{ paper.total_score }} 限时：{{ paper.time_limit }}</div>
      </div>
      <div class="paper-content">
        <div class="question" v-for="(item, index) in paper.questions" :id="'question' + index" :key="item.id">
          <div class="title">{{ index + 1 }}. {{ item.question }} &nbsp; ({{ item.score }}分)</div>
          <div class="options">
            <el-checkbox-group v-model="answers[index]" v-if="item.type === 'multi'">
              <el-checkbox v-for="(option, n) in item.options" :label="n" :key="n"
                           @change="onAnswerChange(index)">{{ option }}
              </el-checkbox>
            </el-checkbox-group>
            <el-radio-group v-model="answers[index]" v-if="item.type === 'single'">
              <el-radio v-for="(option, n) in item.options" :label="n" :key="n"
                        @change="onAnswerChange(index)">{{ option }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="submit">
        <el-button type="primary" @click="showConfirmDialog" size="large">提交</el-button>
      </div>
    </el-form>
    <el-card class="answer-status" v-if="paper">
      <div slot="header">
        答题状态
        <div class="left-time">{{ leftTime }}</div>
      </div>
      <div class="numbers">
        <span v-for="(item, index) in boxStatus" :class="{done: item}">
            {{ index + 1 }}
        </span>
      </div>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
    >
      <div slot="title" v-if="dialogTitle">{{ dialogTitle }}</div>
      <div>{{ dialogContent }}</div>
      <div slot="footer">
        <el-button @click="dismissDialog">取消</el-button>
        <el-button @click="onDialogConfirm" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios';
  import _ from 'lodash';

  export default {
    data() {
      return {
        paper: null,
        answers: null,
        boxStatus: null,
        scoreId: null,
        loadingPaper: false,
        dialogTitle: null,
        dialogContent: null,
        onDialogConfirm: this.dismissDialog,
        dialogVisible: false,
        autoSaveHandler: null,
        lastSaveAnswers: null,
        autoSaveInterval: 5000,
        deadline: null,
        leftTime: null,
        countDownHandler: null,
        checkingStatus: false,
        testStatus: null,
        lastScore: null,
        password: '',
        passwordError: null,
        errorMessage: null,
        openTime: null,
      };
    },
    methods: {
      checkTestStatus() {
        this.checkingStatus = true;
        axios.get(`/api/papers/${this.$route.params.id}/check`).then(res => {
          this.checkingStatus = false;
          const data = res.data;
          this.testStatus = data.errors;
          if (data.errors === 1 || data.errors === 2) {
            this.$message.info('继续未完成的测试');
            this.setupPaper(data);
          } else if (data.errors === 3) {
            this.lastScore = data.score;
          } else if (data.errors === 5) {
            this.openTime = new Date(data.open_time);
            this.startCountDown();
          } else if (data.errors === 6) {

          }
        });
      },
      startTest() {
        if (this.loadingPaper) {
          return;
        }
        if (this.testStatus === 4 && this.password === '') {
          this.errorMessage = '请输入密码';
          return;
        }
        this.loadingPaper = true;
        axios.post(`/api/papers/${this.$route.params.id}/start`, {
          force: this.testStatus === 3,
          password: this.testStatus === 4 ? this.password : null,
        }).then((res) => {
          const data = res.data;
          this.loadingPaper = false;
          if (!data.errors) {
            this.errorMessage = null;
            this.setupPaper(data);
          } else {
            if (data.errors === 1) {
              this.errorMessage = '该测试不存在';
            } else if (data.errors === 2) {
              this.errorMessage = '你已完成该测试';
            } else if (data.errors === 3) {
              this.errorMessage = '密码错误';
            } else {
              this.errorMessage = '发生未知错误';
            }
          }
        });
      },
      submit() {
        this.stopAutoSave();
        axios.post('/api/papers/submit/' + this.scoreId, {
          answers: this.answers,
        }).then((res) => {
          this.stopCountDown();
          const data = res.data;
          if (!data.errors) {
            this.showScoreDialog(data.score);
          } else {
            let msg = null;
            let onConfirm = () => {
              this.$router.push({ name: 'myscores' });
            };
            console.log(data);
            if (data.errors === 3) {
              msg = `你的成绩已出，本次提交无效，你的成绩为${data.score}分`;
            } else if (data.errors === 2) {
              msg = `你的提交已超时，以服务器上最后保存的答案做评分，你上次的成绩为${data.score}分`;
            } else {
              msg = '未知错误';
              onConfirm = null;
            }
            this.showDialog('发生错误', msg, onConfirm);
          }
        });
      },
      autoSave() {
        if (this.hasAnswerChanged()) {
          axios.post('/api/papers/autoSave', {
            paper_id: this.paper.id,
            answers: this.answers,
          }).then(res => {
            const data = res.data;
            if (data.errors) {
              this.stopAutoSave();
              console.error(data.errors);
            } else {
              this.lastSaveAnswers = _.cloneDeep(this.answers);
            }
          });
        }
      },
      initAnswers(content) {
        const answers = new Array(content.length);
        content.forEach(function (question, index) {
          if (question.type === 'single') {
            answers[index] = null;
          } else if (question.type === 'multi') {
            answers[index] = [];
          } else if (question.type === 'filling') {
            answers[index] = "";
          }
        });
        return answers;
      },
      setupPaper(data) {
        this.scoreId = data.score_id;
        this.paper = data.paper;
        this.paper.questions = JSON.parse(data.paper.content);
        this.answers = data.answers ? data.answers : this.initAnswers(this.paper.questions);
        this.boxStatus = this.answers.map(item => this.isDone(item));
        this.deadline = new Date(data.deadline);

        this.lastSaveAnswers = _.cloneDeep(this.answers);

        if (data.continue) {
          this.$message({
            type: 'success',
            message: '继续未完成的测试',
          });
        }

        this.startAutoSave();
        this.startCountDown();
      },
      isDone(answer) {
        if (Array.isArray(answer)) {
          return answer.length > 0;
        }
        return !!answer || answer === 0;
      },
      onAnswerChange(index) {
        this.$set(this.boxStatus, index, this.isDone(this.answers[index]))
      },
      dismissDialog() {
        this.dialogVisible = false;
      },
      showDialog(title, content, onConfirm) {
        this.dialogTitle = title;
        this.dialogContent = content;
        if (typeof onConfirm === 'function') {
          this.onDialogConfirm = onConfirm;
        } else {
          this.onDialogConfirm = this.dismissDialog;
        }
        this.dialogVisible = true;
      },
      showConfirmDialog() {
        const done = this.doneCount();
        const title = '确认提交？';
        const content = done === this.boxStatus.length ? '已完成所有题目！' :
          `部分题目尚未完成（${done}/${this.boxStatus.length}），是否确认提交？`;
        this.showDialog(title, content, this.submit);
      },
      showScoreDialog(score) {
        let title = '成绩';
        let content = `您的分数为${score}分`;
        let onConfirm = () => {
          this.$router.replace({ name: 'myscores' });
        };
        this.showDialog(title, content, onConfirm);
      },
      doneCount: function () {
        let count = 0;
        for (let i = 0; i < this.boxStatus.length; i++) {
          if (this.boxStatus[i]) {
            count++;
          }
        }
        return count;
      },
      startAutoSave() {
        if (this.autoSaveHandler === null) {
          setInterval(this.autoSave, this.autoSaveInterval);
        }
      },
      stopAutoSave() {
        if (this.autoSaveHandler !== null) {
          clearInterval(this.autoSave);
          this.autoSaveHandler = null;
        }
      },
      hasAnswerChanged() {
        return !_.every(this.lastSaveAnswers, (old, index) => {
          let now = this.answers[index];
          if (_.isArray(old) && _.isArray(now)) {
            return old.length === now.length && _.difference(old, now).length === 0;
          }
          return old === now;

        });
      },
      startCountDown() {
        if (this.countDownHandler === null) {
          this.countDownHandler = setInterval(this.updateLeftTime, 500);
        }
      },
      stopCountDown() {
        if (this.countDownHandler !== null) {
          clearInterval(this.countDownHandler);
          this.countDownHandler = null;
        }
      },
      updateLeftTime() {
        let time = (this.paper ? this.deadline : this.openTime) - new Date();
        if (time < 0) {
          time = 0;
        }
        if (!this.paper && time <= 0) {
          this.startTest();
          this.stopCountDown();
        }
        this.leftTime = this.beautifyTime(time);
      },
      beautifyTime(ms) {
        const time = Math.floor(ms / 1000);
        let hour = Math.floor(time / 3600);
        let day = 0;
        if (hour > 23) {
          day = Math.floor(hour / 24);
          hour = hour % 24;
        }
        let minute = Math.floor((time - 3600 * (hour + day * 24)) / 60);
        let second = time - (hour + day * 24) * 3600 - minute * 60;
        return `${day > 0 ? day + '天 ' : ''}${hour > 9 ? hour : '0' + hour}:${minute > 9 ? minute : '0' + minute}:${second > 9 ? second : '0' + second}`;
      }
    },
    beforeDestroy() {
      this.stopAutoSave();
      this.stopCountDown();
    },
    mounted() {
      if (this.$route.query.password) {
        this.password = this.$route.query.password;
      }
      this.checkTestStatus();
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 700px;
    margin: 0 auto;
  }

  .has-score {
    text-align: center;
  }

  .need-password {
    margin-bottom: 18px;
    p {
      margin: 6px 0;
    }
  }

  .wait-for-open {
    p {
      font-size: 18px;
    }

    div {
      font-size: 26px;
    }
  }

  .start-test {
    text-align: center;
  }

  .paper {
    width: 100%;
  }

  .paper-header {
    text-align: center;
    margin: 20px 0 14px;
    .title {
      font-size: 28px;
    }
    .subtitle {
      font-size: 24px;
      margin-top: 16px;
    }
  }

  .question {
    .title {
      font-size: 16px;
      margin: 12px 0;
    }
  }

  .submit {
    margin-top: 25px;
    text-align: center;
    > * {
      width: 120px;
      font-size: 18px;
    }
  }

  label.el-radio, label.el-checkbox {
    display: block;
    margin-left: 0 !important;
    line-height: 16px;
    &:not(:first-child) {
      margin-top: 10px;
    }
  }

  .answer-status {
    position: fixed;
    right: 40px;
    top: 150px;
    width: 260px;

    .left-time {
      float: right;
    }

    .numbers {
      display: flex;
      flex-wrap: wrap;
      margin-left: -6px;
      margin-right: -6px;
    }

    span {
      display: inline-block;
      width: 32px;
      height: 32px;
      line-height: 32px;
      border: 1px solid #979797;
      border-radius: 50%;
      text-align: center;
      margin: 6px;

      &.done {
        background-color: #409eff;
      }
    }
  }
</style>