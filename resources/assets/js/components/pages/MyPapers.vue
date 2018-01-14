<template>
    <div>
        <el-table
                :data="papers"
        >
            <el-table-column
                    prop="index"
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
                    <el-button type="text" @click="editPaper(scope.row.id)">编辑</el-button>
                    <el-button type="text" @click="removePaper(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import Navbar from '../user/Navbar.vue';
    export default {
        components: { Navbar },
        data() {
            return {
                papers: null,
            };
        },
        methods: {
            loadPapers() {
                this.$axios.get('/api/papers/my').then(res => {
                    let data = res.data;
                    if (!data.errors) {
                        this.papers = data.papers.map((item, index) => {
                            const content = JSON.parse(item.content);
                            return this.$_.assign({}, item, {
                                index: index + 1,
                                questions: content,
                            })
                        })
                    }
                });
            },
            editPaper(id) {
                this.$router.push({ name: 'editPaper', params: { id: id } });
            },
            removePaper(row) {

            }
        },
        created: function() {
            this.loadPapers();
        }
    }
</script>

<style lang="scss" scoped>

</style>