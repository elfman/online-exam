<template>
    <div class="panel container">
        <div class="panel-heading">
            <h3 class="text-center">{{ paper.title }}</h3>
            <h5 class="text-center">总分：{{ paper.total_score }} 限时：{{ paper.time_limit }}</h5>
        </div>
        <div class="panel-body">
            <div class="row form-group" v-for="(item, index) in paper.content" :id="'question' + index">
                <h5>{{ index + 1 }}. {{ item.question }} &nbsp; ({{ item.score }}分)</h5>
                <div>
                    <div class="radio" v-if="item.type === 'single'" v-for="(option, n) in item.options">
                        <label>
                            <input type="radio" :name="'q' + index" :value="n" v-model="answers[index]" @change="onInputChange" :data-index="index">
                            {{ option }}
                        </label>
                    </div>
                    <div class="checkbox" v-if="item.type === 'multi'" v-for="(option, n) in item.options">
                        <label>
                            <input type="checkbox" :name="'q' + index" :value="n" v-model="answers[index]" @change="onInputChange" :data-index="index">
                            {{ option }}
                        </label>
                    </div>
                    <div class="form-group" v-if="item.type === 'filling'">
                        <input class="form-control" type="text" :name="'q' + index" v-model="answers[index]" @change="onInputChange" @input="onInputChange" :data-index="index">
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default number-box">
            <div class="panel-heading">完成状态</div>
            <div class="panel-body">
                <div class="numbers">
                    <span v-for="(item, index) in boxStatus" :class="{done: item}">
                        {{ index + 1 }}
                    </span>
                </div>
            </div>
        </div>
        <div class="text-center">
            <button class="btn btn-primary btn-lg" style="width: 200px;" data-toggle="modal" data-target="#confirmModal">提交</button>
        </div>
        <div class="modal fade" role="dialog" id="confirmModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal">&times;</button>
                        <h4>确认提交？</h4>
                    </div>
                    <div class="modal-body">
                        <p>{{ doneCount === boxStatus.length ? '已完成所有题目！' : `部分题目尚未完成（${doneCount}/${boxStatus.length}），是否确认提交？` }}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" data-dismiss="modal">确认</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            paperJson: String,
            url: String,
        },
        data() {
            let paper = this.setPaper(this.paperJson);
            let answers = this.initAnswers(paper.content);
            return {
                paper,
                answers,
                boxStatus: new Array(answers.length),
            }
        },
        methods: {
            setPaper(json) {
                let paper = JSON.parse(json);
                paper.content = JSON.parse(paper.content);
                return paper;
            },
            initAnswers(content) {
                let answers = new Array(content.length);
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
            onInputChange(event) {
                let index = event.srcElement.dataset.index;
                this.$set(this.boxStatus, index, this.isDone(this.answers[index]))
            },
            onSubmit() {
                $.post()
            }
        },
        mounted() {
        },
        computed: {
            doneCount: function() {
                let count = 0;
                for (item in this.boxStatus) {
                    if (item) {
                        count++;
                    }
                }
                return count;
            }
        },
        watch: {
            paperJson: function (val) {
                this.paper = this.setPaper(val);
                this.answers = this.initAnswers(this.paper.content);
                this.boxStatus = new Array(this.answers.length);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        max-width: 700px;
    }
    .number-box {
        position: fixed;
        right: 40px;
        top: 150px;
        width: 250px;
        
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
                background-color: #1cc091;
            }
        }
    }
</style>
