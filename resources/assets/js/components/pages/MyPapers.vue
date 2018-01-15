<template>
    <div>
        <router-link to="createPaper"><el-button type="primary">添加新试卷</el-button></router-link>
        <el-table
                :data="papers"
                v-loading="loading"
        >
            <el-table-column
                    type="index"
                    label="#"
                    width="80"
            ></el-table-column>
            <el-table-column
                    prop="title"
                    label="标题"
                    width="550"
            ></el-table-column>
            <el-table-column
                    prop="questions.length"
                    label="总题数"
                    width="100"
            ></el-table-column>
            <el-table-column
                    prop="total_score"
                    label="总分"
                    width="100"
            ></el-table-column>
            <el-table-column
                    prop="time_limit"
                    label="限时"
                    width="100"
            ></el-table-column>
            <el-table-column
                    prop="participation_count"
                    label="已参加人数"
                    width="100"
            ></el-table-column>
            <el-table-column
                    prop="created_at"
                    label="创建时间"
                    width="180"
            ></el-table-column>
            <el-table-column
                    prop="operations"
                    label="操作"
            >
                <template slot-scope="scope">
                    <router-link :to="{ name: 'editPaper', params: { id: scope.row.id } }"><el-button type="text">编辑</el-button></router-link>
                    <el-button type="text" @click="removePaper(scope)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                papers: null,
                loading: false,
            };
        },
        methods: {
            loadPapers() {
                this.loading = true;
                this.$axios.get('/api/papers/my').then(res => {
                    this.loading = false;
                    let data = res.data;
                    if (!data.errors) {
                        this.papers = data.papers.map((item, index) => {
                            const content = JSON.parse(item.content);
                            return this.$_.assign({}, item, {
                                questions: content,
                            })
                        })
                    }
                });
            },
            editPaper(id) {
                this.$router.push({ name: 'editPaper', params: { id: id } });
            },
            removePaper(scope) {
                console.log(scope);
                axios.get(`/api/papers/${scope.row.id}/remove`).then(res => {
                    const data = res.data;
                    if (!data.errors) {
                        this.papers.splice(scope.$index, 1);
                    }
                });
            }
        },
        created: function() {
            this.loadPapers();
        }
    }
</script>

<style lang="scss" scoped>

</style>