<template>
  <div class="container" v-loading="loadingPaper">
    <div class="start-test" v-if="!paper">
      <div class="checking-status" v-if="checkingStatus"><h3>正在获取...</h3></div>
      <template v-else>
        <div class="has-score" v-if="testStatus === 3">
          <p>你已经参加过此次测试，你的分数是 <strong>{{ lastScore }}</strong> 分</p>
          <p>是否重新测试？</p>
        </div>
        <el-button type="primary" @click="startTest" size="large" v-if="testStatus === 0 || testStatus === 3">开始测试</el-button>
      </template>
    </div>
    <el-form v-if="paper" class="paper" ref="form">
      <div class="paper-header">
        <div class="title">{{ paper.title }}</div>
        <div class="subtitle">总分：{{ paper.total_score }} 限时：{{ paper.time_limit }}</div>
      </div>
      <div class="paper-content">
        <div class="question" v-for="(item, index) in paper.content" :id="'question' + index" :key="item.id">
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
            this.setupPaper(data);
          } else if (data.errors === 3) {
            this.lastScore = data.score;
          }
        });
      },
      startTest() {
        if (this.loadingPaper) {
          return;
        }
        this.loadingPaper = true;
        axios.get(`/api/papers/${this.$route.params.id}/start`, {
          params: {
            force: this.testStatus === 3,
          }
        }).then((res) => {
          const data = res.data;
          this.loadingPaper = false;
          if (!data.errors) {
            this.setupPaper(data);
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
            if (data.errors === 1) {
              msg = `你的成绩已出，本次提交无效，你的成绩为${data.score}分`;
            } else if (data.errors === 2) {
              msg = `你的提交已超时，以服务器上最后保存的答案做评分，你的成绩为${data.score}分`;
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
      parsePaper(json) {
        let paper = JSON.parse(json);
        paper.content = JSON.parse(paper.content);
        return paper;
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
        this.paper = this.parsePaper(data.paper);
        this.answers = data.answers ? data.answers : this.initAnswers(this.paper.content);
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
        let time = Math.floor((this.deadline - new Date()) / 1000);
        if (time < 0) {
          time = 0;
        }
        const hour = Math.floor(time / 3600);
        let minute = Math.floor((time - 3600 * hour) / 60);
        let second = time - hour * 3600 - minute * 60;
        let str = `${hour > 9 ? hour : '0' + hour}:${minute > 9 ? minute : '0' + minute}:${second > 9 ? second : '0' + second}`;
        this.leftTime = str;
      }
    },
    beforeDestroy() {
      this.stopAutoSave();
      this.stopCountDown();
    },
    mounted() {
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