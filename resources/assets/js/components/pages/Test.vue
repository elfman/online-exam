<template>
  <div class="container" v-loading="loadingPaper">
    <div class="start-test" v-if="!paper">
      <el-button type="primary" @click="startTest" size="large">开始测试</el-button>
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

  export default {
    data() {
      return {
        paper: null,
        answers: null,
        boxStatus: null,
        sheetId: null,
        loadingPaper: false,
        dialogTitle: null,
        dialogContent: null,
        onDialogConfirm: this.dismissDialog,
        dialogVisible: false,
      };
    },
    methods: {
      startTest() {
        if (this.loadingPaper) {
          return;
        }
        this.loadingPaper = true;
        axios.get(`/api/papers/${this.$route.params.id}/start`, {
          params: {
            force: true
          }
        }).then((res) => {
          const data = res.data;
          console.log(data);
          this.loadingPaper = false;
          if (!data.error) {
            this.sheetId = data.sheet_id;
            this.paper = this.parsePaper(data.paper);
            this.answers = this.initAnswers(this.paper.content);
            this.boxStatus = new Array(this.answers.length);
          }
        });
      },
      submit() {
        axios.post('/api/papers/submit', {
          sheet_id: this.sheetId,
          answers: this.answers,
        }).then((res) => {
          const data = res.data;
          if (!data.errors) {
            this.showScoreDialog(data.score);
          }
        });
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
          this.$router.replace({ name: 'scores' });
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 650px;
    margin: 0 auto;
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