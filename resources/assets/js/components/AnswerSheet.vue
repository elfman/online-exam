<template>
  <div class="container">
    <div class="answer" v-for="(item, index) in paper.questions">
      <div class="title">{{ index + 1 }}. {{ item.question }} &nbsp; ({{ item.score }}分)</div>
      <el-checkbox-group :value="answers[index]" v-if="item.type === 'multi'">
        <div class="answer-option checkbox" v-for="(option, n) in item.options">
          <i class="judge" :class="{'el-icon-check': isRightAnswer(index,n) === 'right', 'el-icon-close': isRightAnswer(index, n) === 'wrong'}"></i>
          <el-checkbox :label="n" :key="n">{{ option }}</el-checkbox>
        </div>
      </el-checkbox-group>
      <el-radio-group :value="answers[index]" v-if="item.type === 'single'">
        <div class="answer-option radio" v-for="(option, n) in item.options">
          <i class="judge" :class="{'el-icon-check': isRightAnswer(index,n) === 'right', 'el-icon-close': isRightAnswer(index, n) === 'wrong'}"></i>
          <el-radio :label="n" :key="n">{{ option }}</el-radio>
        </div>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      answers: Array,
      paper: {
        questions: Array,
        answers: Array,
      },
    },
    data() {
      return {};
    },
    methods: {
      isRightAnswer(questionIndex, optionIndex) {
        const rightAnswer = this.paper.answers[questionIndex];
        const type = this.paper.questions[questionIndex].type;
        if (type === 'multi') {
          const checked = this.answers[questionIndex].indexOf(optionIndex) !== -1
          const shouldChecked = rightAnswer.indexOf(optionIndex) !== -1;
          if (shouldChecked) {
            return 'right';
          }
          if (checked) {
            return 'wrong';
          }
          return 'none';
        } else if (type === 'single') {
          if (rightAnswer === optionIndex) {
            return 'right';
          }
          if (this.answers[questionIndex] === optionIndex) {
            return 'wrong';
          }
          return 'none';
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    margin-top: -20px;
  }

  .answer-option {
    display: flex;
  }

  .judge {
    margin-top: 10px;
    font-size: 16px;
    width: 25px;
    &.el-icon-check {
      color: #67C23A;
    }
    &.el-icon-close {
      color: #F56C6C;
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
</style>