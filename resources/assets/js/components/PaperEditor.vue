<template>
    <div class="wrapper">
        <el-form label-width="80px" :model="paper">
            <el-form-item label="标题" prop="title">
                <el-input v-model="paper.title"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="time">
                <el-input v-model="paper.time_limit">
                    <template slot="append">分钟</template>
                </el-input>
            </el-form-item>
        </el-form>

        <div>
            <div v-for="(item, index) in paper.questions" :key="index" class="question">
                <question
                        :question="item"
                        :id="index"
                        @save="onSaveQuestion"
                        @remove="onRemoveQuestion"
                        @up="onQuestionUp"
                        @down="onQuestionDown"
                ></question>
            </div>
            <question
                    v-if="addingQuestion"
                    @create="onCreateQuestion"
                    @cancel="onQuestionCancel"
                    :edit="true"
            ></question>
            <el-button class="create" type="primary" icon="el-icon-circle-plus" @click="addQuestion">添加新题目</el-button>
        </div>
        <hr>
        <el-row>
            <el-col :span="4" :offset="10">
                <el-button type="primary" size="large" @click="save">保存试卷</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        props: {
            paperJson: String,
            url: String,
        },
        data() {
            let paper;
            if (this.paperJson) {
                paper = JSON.parse(this.paperJson);
                paper.questions = JSON.parse(paper.content);
                let answers = JSON.parse(paper.answers);
                paper.questions.forEach((item, index) => {
                    item.answer = answers[index];
                    item.title = item.question;
                });
            } else {
                paper = {
                    title: '',
                    time_limit: 60,
                    questions: [],
                    answers: [],
                }
            }

            return {
                paper,
                addingQuestion: false,
            }
        },
        methods: {
            loadPaper() {
            },
            addQuestion() {
                this.addingQuestion = true;
            },
            onQuestionCancel() {
                this.addingQuestion = false;
            },
            onCreateQuestion(question) {
                this.paper.questions.push(question);
                this.addingQuestion = false;
            },
            onSaveQuestion(id, question) {
                this.$set(this.paper.questions, id, question)
            },
            onRemoveQuestion(id) {
                this.paper.questions.splice(id, 1);
            },
            onQuestionUp(id) {
                if (id === 0) {
                    return;
                }
                let questions = this.paper.questions;
                let temp = questions[id];
                this.$set(questions, id, questions[id - 1]);
                this.$set(questions, id - 1, temp);
            },
            onQuestionDown(id) {
                let questions = this.paper.questions;
                if (id === questions.length - 1) {
                    return;
                }
                let temp = questions[id];
                this.$set(questions, id, questions[id + 1]);
                this.$set(questions, id + 1, temp);
            },
            save() {
                let url = this.paper.id ? `/papers/${this.paper.id}` : '/papers/store';
                let answers = [];
                let questions = this.paper.questions.map((item) => {
                    answers.push(item.answer);
                    return {
                        question: item.title,
                        type: item.type,
                        score: item.score,
                        options: item.options,
                    }
                });
                axios({
                    url,
                    method: 'put',
                    data: {
                        title: this.paper.title,
                        time_limit: this.paper.time_limit,
                        questions,
                        answers,
                    },
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                }).then(response => {
                    if (!response.data.error) {
                        this.$message({
                            message: this.paper.id ? '保存成功' : '创建成功',
                            type: 'success',
                        });
                    } else {
                        this.$message({
                            message: this.paper.id ? '保存失败' : '创建失败',
                            type: 'error',
                        });
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    label.el-radio, label.el-checkbox {
        display: block;
        margin-left: 0 !important;
        line-height: 16px;
        &:not(:first-child) {
            margin-top: 10px;
        }
    }
    .question {
        margin-bottom: 16px;
    }
    .create {
        margin-top: 12px;
    }
</style>