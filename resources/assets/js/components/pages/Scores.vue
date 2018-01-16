<template>
  <el-table v-loading="loading" :data="data">
    <el-table-column type="index" label="#"></el-table-column>
    <el-table-column prop="title" label="标题" width="400"></el-table-column>
    <el-table-column prop="score" label="分数"></el-table-column>
    <el-table-column prop="total_score" label="总分"></el-table-column>
    <el-table-column prop="start_time" label="开始时间"></el-table-column>
    <el-table-column label="用时">
      <template slot-scope="scope">
        <span v-if="scope.row.spend_time">{{scope.row.spend_time}}</span>
        <span v-else>
          尚未完成
          <router-link :to="{ name: 'paper', params: { id: scope.row.paper_id } }">
            <el-button type="text">继续</el-button>
          </router-link>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        data: null,
        loading: false,
      };
    },
    methods: {
      loadScores() {
        this.loading = true;
        axios.get('/api/papers/myscores').then(res => {
          this.loading = false;
          const data = res.data;
          if (!data.errors) {
            const scores = data.scores;
            scores.map(score => {
              if (score.complete_time) {
                score.spend_time = Math.ceil((new Date(score.complete_time) - new Date(score.start_time)) / 60000) + '分钟';
              } else {
                score.spend_time = null;
              }
            });
            this.data = scores;
          }
        })
      },
    },
    mounted() {
      console.log('moutned')
      this.loadScores();
    }
  }
</script>

<style lang="scss" scoped>

</style>