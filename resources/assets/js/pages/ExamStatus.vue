<template>
  <div>
    <div class="title" v-if="paper">{{ paper.title }}</div>
    <div class="analysis" v-if="paper">
      <div>
        <p>参与人数：<span>{{ totalCount }}</span></p>
        <p>平均用时：<span>{{ averageTime.toHHMMSS() }}</span></p>
        <p>平均分数：<span>{{ averageScore.toFixed(2) }}</span></p>
        <p>及格人数：<span>{{ passCount }}</span></p>
      </div>
      <div class="charts">
        <div>
          <p>分数统计：</p>
          <score-chart :chart-data="chartData" :options="scoreChartOption" :width="600" :height="400"></score-chart>
        </div>
        <div>
          <p>正确率统计：</p>
          <score-chart :chart-data="accuracyData"  :options="accuracyOption" :width="600" :height="400"></score-chart>
          <div class="range-buttons" v-if="paper.questions.length > accuracyRangeLength">
            <el-button
              size="small"
              v-for="(item, index) in accuracyRangeButtons" :key="item"
              :type="accuracyRangeIndex === index ? 'primary' : 'default'"
              @click="changeAccuracyDataRange(index)"
            >
              {{ item }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="score" label="分数"></el-table-column>
      <el-table-column prop="time" label="用时"></el-table-column>
      <el-table-column prop="complete_time" label="完成时间"></el-table-column>
      <el-table-column prop="operations" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleAnswerClick(scope.$index)">查看答案</el-button>
          <el-button type="text" @click="handleRemoveClick(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showAnswerDialog" :title="dialogTitle" top="20px">
      <answer-sheet :paper="paper" :answers="scores[scoreIndex].answers" v-if="scoreIndex !== null"></answer-sheet>
      <div slot="footer">
        <el-button @click="showAnswerDialog = false" type="primary">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios';

  import AnswerSheet from '../components/AnswerSheet.vue';
  import ScoreChart from '../components/ScoreChart.vue';
  import QuestionChart from '../components/QuestionChart.vue';

  export default {
    components: {
      scoreChart: ScoreChart,
      questionChart: QuestionChart,
      answerSheet: AnswerSheet,
    },
    data() {
      const accuracyOption = {
        responsive: false,
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              max: 100,
              callback: function (value) {
                return value + '%';
              }
            },
          }]
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            title: (item, data) => {
              return '题目 ' + item[0].xLabel;
            },
            label: item => {
              return `正确率：${item.yLabel}%`;
            }
          }
        }
      };

      const scoreChartOption = {
        responsive: false,
        legend: {
          display: false,
        }
      };
      return {
        scores: null,
        paper: null,
        loading: false,
        scoreIndex: null,
        showAnswerDialog: false,
        totalCount: null,
        averageScore: null,
        averageTime: null,
        passCount: null,
        accuracies: null,
//        accuracyData: null,
        accuracyOption,
        scoreChartOption,
        accuracyRangeLength: 25,
        accuracyRangeIndex: 0,
        accuracyRangeButtons: null,
      };
    },
    methods: {
      loadScores() {
        this.loading = true;
        axios.get(`/api/papers/${this.$route.params.id}/status`).then(res => {
          const data = res.data;
          this.scores = data.scores;
          this.paper = data.paper;

          this.paper.answers = JSON.parse(this.paper.answers);
          this.paper.questions = JSON.parse(this.paper.content);
          this.scores.forEach(item => item.answers = JSON.parse(item.answers));
          this.analyze();
        }).catch(error => {
          console.error(error);
          let msg = null;
          if (error.response.status === 403) {
            msg = '无权访问此试卷信息';
          } else {
            msg = '载入信息时发生未知错误';
          }
          this.$message.error(msg);
        }).finally(() => {
          this.loading = false;
        });
      },
      handleAnswerClick(index) {
        this.scoreIndex = index;
        this.showAnswerDialog = true;
      },
      handleRemoveClick(index) {
        axios.get(`/api/scores/${this.scores[index].id}/remove`).then(res => {
          if (!res.data.errors) {
            this.$message.success('删除成功');
            this.scores.splice(index, 1);
          }
        });
      },
      analyze() {
        let totalScore = 0;
        let totalTime = 0;
        let passCount = 0;
        let correctCount = new Array(this.paper.questions.length);
        _.fill(correctCount, 0);

        this.scores.forEach((score) => {
          totalScore += score.score;
          score.costTime = Math.floor((new Date(score.complete_time) - new Date(score.start_time)) / 1000);
          totalTime += score.costTime;
          if (score.score >= 60) {
            passCount++;
          }
          score.answers.forEach((answer, index) => {
            const rightAnswer = this.paper.answers[index];
            const type = this.paper.questions[index].type;
            let correct = false;
            if (type === 'single') {
              correct = rightAnswer === answer;
            } else if (type === 'multi') {
              correct = rightAnswer.length === answer.length && _.difference(rightAnswer, answer).length === 0;
            }
            if (correct) correctCount[index]++;
          });
        });


        this.totalCount = this.scores.length;
        this.averageScore = (totalScore / this.totalCount);
        this.averageTime = Math.ceil(totalTime / this.totalCount);
        this.passCount = passCount;
        this.accuracies = correctCount.map(item => ((item / this.totalCount) * 100).toFixed(2));

        const buttons = [];
        for (let i = 0; i < this.paper.questions.length; i+=this.accuracyRangeLength) {
          let max = this.accuracyRangeLength + i - 1;
          if (max > this.paper.questions.length) {
            max = this.paper.questions.length;
          }
          buttons.push(`${i + 1} - ${max}`)
        }
        this.accuracyRangeButtons = buttons;
      },
      changeAccuracyDataRange(index) {
        this.accuracyRangeIndex = index;
      }
    },
    mounted() {
      this.loadScores();
    },
    computed: {
      chartData() {
        if (!this.scores) return null;

        const data = new Array(10);

        _.fill(data, 0);

        this.scores.map(score => {
          const index = Math.floor(score.score/10);
          data[index]++;
        });
        console.log(data);
        return {
          labels: ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90-100'],
          datasets: [
            {
              label: '人数',
              fillColor: '#409eff',
              strokeColor: '#rgba(220, 220, 220, 1)',
              barStrokeWidth: 1,
              data: data,
            }
          ]
        }
      },
      accuracyData() {
        if (!this.paper) return null;

        let labels = null;
        if (this.paper.questions.length <= this.accuracyRangeLength) {
          labels = _.range(1, this.paper.questions.length + 1, 1);
        } else {
          let max = this.accuracyRangeLength * (this.accuracyRangeIndex + 1);
          if (max > this.paper.questions.length) {
            max = this.paper.questions.length;
          }
          labels = _.range(this.accuracyRangeLength * this.accuracyRangeIndex + 1, max, 1);
        }

        return {
          labels,
          datasets: [
            {
              label: '正确率',
              fillColor: '#409eff',
              strokeColor: '#rgba(220, 220, 220, 1)',
              data: _.slice(this.accuracies, labels[0] - 1, labels[labels.length - 1] - 1),
            }
          ]
        };
      },
      tableData() {
        if (this.scores === null) return null;

        return this.scores.map(item => {
          return {
            id: item.id,
            username: item.user.name,
            score: item.score,
            time: (new Date(item.complete_time) - new Date(item.start_time)).toHHMMSS(true),
            complete_time: item.complete_time,
          }
        })
      },
      dialogTitle() {
        if (this.scoreIndex === null) {
          return null;
        }
        const score = this.scores[this.scoreIndex];
        return `${score.user.name} —— 分数：${score.score}`;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .charts {
    display: flex;
    justify-content: center;
    > *:first-child {
      margin-right: 30px;
    }
  }
  @media (max-width: 700px) {
    .charts {
      display: block;
    }
  }
  .title {
    font-size: 18px;
  }

  .range-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
</style>