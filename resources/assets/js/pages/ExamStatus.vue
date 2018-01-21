<template>
  <div>
    <div class="title" v-if="paper">{{ paper.title }}</div>
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
    <el-dialog :visible.sync="showAnswerDialog" :title="dialogTitle" top="60px">
      <answer-sheet :paper="paper" :answers="scores[scoreIndex].answers" v-if="scoreIndex !== null"></answer-sheet>
      <div slot="footer">
        <el-button @click="showAnswerDialog = false" type="primary">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { Bar } from 'vue-chartjs';
  import axios from 'axios';

  import AnswerSheet from '../components/AnswerSheet.vue';

  export default {
    components: {
      barChart: Bar,
      answerSheet: AnswerSheet,
    },
    data() {
      return {
        scores: null,
        paper: null,
        loading: false,
        scoreIndex: null,
        showAnswerDialog: false,
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
    },
    mounted() {
      this.loadScores();
    },
    computed: {
      chartData() {

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
        return `${score.user.name} —— 总分：${score.score}`;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    font-size: 18px;
  }
</style>