<template>
  <div>
    <div class="title" v-if="paper">{{ paper.title }}</div>
    <div class="analysis" v-if="paper">
      <div class="badges">
        <div class="card score">
          <div class="left">
            <i class="el-icon-document"></i>
          </div>
          <div class="right">
            <div class="label">平均分数</div>
            <div class="data">{{ averageScore.toFixed(2) }}</div>
            <div class="sub">总分：{{ paper.total_score }}</div>
          </div>
        </div>
        <div class="card person">
          <div class="left">
            <i class="el-icon-star-on"></i>
          </div>
          <div class="right">
            <div class="label">及格人数</div>
            <div class="data">{{ passCount }}</div>
            <div class="sub">参与人数：{{ totalCount }}</div>
          </div>
        </div>
        <div class="card time">
          <div class="left">
            <i class="el-icon-time"></i>
          </div>
          <div class="right">
            <div class="label">平均用时</div>
            <div class="data">{{ averageTime.toHHMMSS() }}</div>
            <div class="sub">限时：{{ (paper.time_limit * 60).toHHMMSS() }}</div>
          </div>
        </div>
      </div>
      <div class="charts">
        <div class="chart">
          <p>分数统计：</p>
          <score-chart :chart-data="chartData" :options="scoreChartOption" :width="500" :height="350"></score-chart>
          <div class="range-buttons" v-if="paper.total_score > 100">
            <el-button
              size="small"
              v-for="(item, index) in scoreRangeButtons" :key="item.range"
              :type="scoreRangeIndex === index ? 'primary' : 'default'"
              @click="scoreRangeIndex = index"
              :disabled="item.count === 0"
            >
              {{ `${item.range} (${item.count})` }}
            </el-button>
          </div>
        </div>
        <div class="chart">
          <p>正确率统计：</p>
          <score-chart :chart-data="accuracyData"  :options="accuracyOption" :width="500" :height="350"></score-chart>
          <div class="range-buttons" v-if="paper.questions.length > chartRangeLength">
            <el-button
              size="small"
              v-for="(item, index) in accuracyRangeButtons" :key="item"
              :type="accuracyRangeIndex === index ? 'primary' : 'default'"
              @click="accuracyRangeIndex = index"
            >
              {{ item }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="用户名" sortable></el-table-column>
      <el-table-column prop="score" label="分数" sortable></el-table-column>
      <el-table-column prop="time" label="用时" sortable></el-table-column>
      <el-table-column prop="complete_time" label="完成时间" sortable></el-table-column>
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
          }],
          xAxes: [{
            barPercentage: 1,
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            title: (item) => {
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
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
            }
          }],
          xAxes: [{
            barPercentage: 1,
          }],
        },
        tooltips: {
          callbacks: {
            title: (item) => {
              return '分数：' + item[0].xLabel;
            }
          }
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
        accuracyOption,
        scoreChartOption,
        chartRangeLength: 25,
        accuracyRangeIndex: 0,
        accuracyRangeButtons: null,
        scoreChartData: null,
        scoreRangeIndex: 0,
        scoreRangeButtons: null,
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

        const accuracyButtons = [];
        for (let i = 0; i < this.paper.questions.length; i+=this.chartRangeLength) {
          let max = this.chartRangeLength + i;
          if (max > this.paper.questions.length) {
            max = this.paper.questions.length;
          }
          accuracyButtons.push(`${i + 1} - ${max}`)
        }
        this.accuracyRangeButtons = accuracyButtons;


        const scoreData = new Array(Math.ceil(this.paper.total_score / 10));

        _.fill(scoreData, 0);

        this.scores.forEach(score => {
          const index = Math.floor(score.score/10);
          scoreData[index]++;
        });

        this.scoreChartData = scoreData;

        const scoreButtons = [];
        this.scoreRangeIndex = null;
        for (let i = 0; i < Math.ceil(this.paper.total_score / 100); i++) {
          let max = (i + 1) * 100;
          if (max > this.paper.total_score) {
            max = this.paper.total_score;
          }

          let count = 0;
          for (let j = i * 10; j < (i + 1) * 10; j++) {
            if (j >= scoreData.length) {
              break;
            }
            count += scoreData[j];
          }
          scoreButtons.push({
            range: `${i * 100} - ${(i + 1) * 100 - 1}`,
            count,
          });
          if (this.scoreRangeIndex === null && count > 0) {
            this.scoreRangeIndex = i;
          }
        }
        this.scoreRangeButtons = scoreButtons;

      },
    },
    mounted() {
      this.loadScores();
    },
    computed: {
      chartData() {
        if (!this.scores) return null;

        const labels = [];

        let start = this.scoreRangeIndex * 100;
        for (let i = 0; i < 10; i++) {
          let max = start + (i + 1) * 10 - 1;
          labels.push(`${start + i * 10} - ${max}`);
          if (max >= this.paper.total_score) {
            break;
          }
        }

        return {
          labels,
          datasets: [
            {
              label: '人数',
              fillColor: '#409eff',
              strokeColor: '#rgba(220, 220, 220, 1)',
              barStrokeWidth: 1,
              data: _.slice(this.scoreChartData, this.scoreRangeIndex * 10, (this.scoreRangeIndex + 1) * 10),
            }
          ]
        }
      },
      accuracyData() {
        if (!this.paper) return null;

        let labels = null;
        if (this.paper.questions.length <= this.chartRangeLength) {
          labels = _.range(1, this.paper.questions.length + 1, 1);
        } else {
          let max = this.chartRangeLength * (this.accuracyRangeIndex + 1);
          if (max > this.paper.questions.length) {
            max = this.paper.questions.length;
          }
          labels = _.range(this.chartRangeLength * this.accuracyRangeIndex + 1, max + 1, 1);
        }

        return {
          labels,
          datasets: [
            {
              label: '正确率',
              fillColor: '#409eff',
              strokeColor: '#rgba(220, 220, 220, 1)',
              data: _.slice(this.accuracies, labels[0] - 1, labels[labels.length - 1]),
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
  .badges {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    padding: 20px 40px;
    .score .left {
      background-color: #409eff;
    }
    .person .left {
      background-color: #67c23a;
    }
    .time .left {
      background-color: #e6a23c;
    }
    .card {
      display: flex;
      border: 1px solid #d7d7d7;
      border-radius: 6px;
      overflow: hidden;
      width: 240px;
      height: 80px;
      &:hover {
        box-shadow: 0 0 5px 6px rgba(240, 240, 240, 0.7);
      }

      .left {
        display: flex;
        height: 80px;
        width: 80px;
        border-right: #d7d7d7;
        justify-content: center;
        align-items: center;
        i {
          font-size: 30px;
          color: white;
        }
      }
      .right {
        padding: 5px 9px;
        width: 160px;
      }
    }
    .label {
      font-size: 14px;
    }
    .data {
      font-size: 22px;
      text-align: right;
    }
    .sub {
      font-size: 12px;
      text-align: right;
    }
  }
  .charts {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    > *:first-child {
      margin-right: 30px;
    }
    .chart > *:nth-child(2) {
      display: flex;
      justify-content: center;
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