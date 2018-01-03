<template>
    <div class="wrapper">
        <div class="text-center" v-if="loadingPaper">正在载入...</div>
        <div class="text-center" v-else-if="!paper">
            <button class="btn btn-primary btn-lg" @click="startTest">开始测试</button>
        </div>
        <div class="panel" v-else>
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
                                <input type="radio" :name="'q' + index" :value="n" v-model="answers[index]"
                                       @change="onInputChange" :data-index="index">
                                {{ option }}
                            </label>
                        </div>
                        <div class="checkbox" v-if="item.type === 'multi'" v-for="(option, n) in item.options">
                            <label>
                                <input type="checkbox" :name="'q' + index" :value="n" v-model="answers[index]"
                                       @change="onInputChange" :data-index="index">
                                {{ option }}
                            </label>
                        </div>
                        <div class="form-group" v-if="item.type === 'filling'">
                            <input class="form-control" type="text" :name="'q' + index" v-model="answers[index]"
                                   @change="onInputChange" @input="onInputChange" :data-index="index">
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
                <button class="btn btn-primary btn-lg" style="width: 200px;" @click="showSubmitConfirmModal">
                    提交
                </button>
            </div>
            <div class="modal fade" role="dialog" id="modal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">&times;</button>
                            <h4>{{ modalTitle }}</h4>
                        </div>
                        <div class="modal-body">
                            <p>{{ modalContent }}</p>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-default" data-dismiss="modal">取消</button>
                            <button class="btn btn-primary" data-dismiss="modal" @click="onModalConfirm">确认</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            paperId: Number,
            startUrl: String,
            submitUrl: String,
        },
        data() {
            return {
                paper: null,
                answers: null,
                boxStatus: null,
                sheetId: null,
                loadingPaper: false,
                modalTitle: null,
                modalContent: null,
                onModalConfirm: this.dismissModal,
            }
        },
        methods: {
            startTest() {
                if (this.loadingPaper) {
                    return;
                }
                this.loadingPaper = true;
                $.get(this.startUrl, { force: true }, (data) => {
                    console.log(data);
                    this.loadingPaper = false;
                    if (!data.error) {
                        this.sheetId = data.sheet_id,
                        this.paper = this.parsePaper(data.paper);
                        this.answers = this.initAnswers(this.paper.content);
                        this.boxStatus = new Array(this.answers.length);
                    }
                });
            },
            parsePaper(json) {
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
                $.ajax({
                    url: this.submitUrl,
                    type: 'POST',
                    contentType: 'application/json',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    data: JSON.stringify({
                        sheet_id: this.sheetId,
                        answers: this.answers,
                    }),
                    success: (data) => {
                        if (!data.error) {
                            this.showScoreModal(data.score);
                        }
                    },
                });
            },
            showModal(title, content, onConfirm) {
                this.modalTitle = title;
                this.modalContent = content;
                this.onModalConfirm = onConfirm ? onConfirm : this.dismissModal;
                $('#modal').modal('show');
            },
            showSubmitConfirmModal() {
                let title = '确认提交？';
                let content = this.doneCount === this.boxStatus.length ? '已完成所有题目！' :
                    `部分题目尚未完成（${this.doneCount}/${this.boxStatus.length}），是否确认提交？`;
                let onConfirm = this.onSubmit;
                this.showModal(title, content, onConfirm);
            },
            showScoreModal(score) {
                let title = '成绩';
                let content = `您的分数为${score}分`;
                let onConfirm = () => {
                    window.location.replace('/myscores');
                };
                this.showModal(title, content, onConfirm);
            },
            dismissModal() {
                $('#modal').modal('hide');
            }
        },
//        mounted() {
//        },
        computed: {
            doneCount: function () {
                let count = 0;
                for (let i = 0; i < this.boxStatus.length; i++) {
                    if (this.boxStatus[i]) {
                        count++;
                    }
                }
                return count;
            }
        },
//        watch: {
//        }
    }
</script>

<style lang="scss" scoped>
    .wrapper {
        max-width: 700px;
        margin: 0 auto;
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
