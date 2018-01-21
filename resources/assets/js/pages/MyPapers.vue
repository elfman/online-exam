<template>
  <div>
    <router-link :to="{ name: 'createPaper' }">
      <el-button type="primary">添加新试卷</el-button>
    </router-link>
    <el-dialog :visible.sync="showLinkDialog">
      <div class="dialog-content">
        <span>链接</span>
        <el-input v-model="dialogLink"></el-input>
      </div>
      <span slot="title">{{ dialogTitle }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showLinkDialog = false" type="primary">关闭</el-button>
      </span>
    </el-dialog>
    <el-table :data="papers" v-loading="loading">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="questions.length" label="总题数" width="100"></el-table-column>
      <el-table-column prop="total_score" label="总分" width="100"></el-table-column>
      <el-table-column prop="time_limit" label="限时" width="100"></el-table-column>
      <el-table-column label="密码" width="100">
        <template slot-scope="scope">
          <el-popover trigger="click" placement="top" v-if="scope.row.password">
            {{ scope.row.password }}
            <el-button type="text" slot="reference">查看</el-button>
          </el-popover>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="participation_count" label="已参加人数" width="100"></el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180"></el-table-column>
      <el-table-column label="开始时间" width="100">
        <template slot-scope="scope">
          <el-popover trigger="click" placement="top" v-if="scope.row.open_time">
            {{ scope.row.open_time }}
            <el-button type="text" slot="reference">{{ getOpenText(scope.row) }}</el-button>
          </el-popover>
          <span slot="reference" v-else>已开始</span>
        </template>
      </el-table-column>
      <el-table-column prop="operations" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="handleLinkClick(scope.row)">链接</el-button>
          <router-link :to="{ name: 'editPaper', params: { id: scope.row.id } }">
            <el-button type="text">编辑</el-button>
          </router-link>
          <el-button type="text" @click="removePaper(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from 'axios';
  import _ from 'lodash';

  export default {
    data() {
      return {
        papers: null,
        loading: false,
        showLinkDialog: false,
        dialogLink: '',
        dialogTitle: '',
      };
    },
    methods: {
      loadPapers() {
        this.loading = true;
        axios.get('/api/papers/my').then(res => {
          this.loading = false;
          let data = res.data;
          if (!data.errors) {
            this.papers = data.papers.map((item, index) => {
              const content = JSON.parse(item.content);
              return _.assign({}, item, {
                questions: content,
              })
            })
          }
        });
      },
      removePaper(scope) {
        console.log(scope);
        axios.get(`/api/papers/${scope.row.id}/remove`).then(res => {
          const data = res.data;
          if (!data.errors) {
            this.papers.splice(scope.$index, 1);
          }
        });
      },
      getOpenText(row) {
        if (row.open_time && new Date(row.open_time) > Date.now()) {
          return '未开始';
        }
        return '已开始';
      },
      handleLinkClick(row) {
        this.dialogTitle = row.title;
        this.dialogLink = location.href + 'papers/' + row.id;
        if (row.password) {
          this.dialogLink += `?password=${row.password}`;
        }
        this.showLinkDialog = true;
      }
    },
    created: function () {
      this.loadPapers();
    }
  }
</script>

<style lang="scss" scoped>
  .dialog-content {
    display: flex;
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      font-size: 16px;
    }
  }
</style>