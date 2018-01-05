<template>
    <div class="panel panel-default wrapper" :id="'question' + number">
        <div class="form-horizontal panel-body">
            <div class="form-group" :class="{'has-error': errors.question}">
                <label class="control-label col-md-1">问题</label>
                <div class="col-md-11">
                    <input type="text" class="form-control" v-model="question">
                    <div class="help-block">
                        <strong>{{ errors.question }}</strong>
                    </div>
                </div>
            </div>
            <div class="form-group" :class="{'has-error': errors.type}">
                <label class="control-label col-md-1">类型</label>
                <div class="col-md-3 col-sm-11 type-dropdown">
                    <div class="dropdown">
                        <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                            {{ type ? typeOptions[type] : '请选择类型' }}
                            <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu" @click="onTypeSelect">
                            <li v-for="(value, key) in typeOptions" :value="key">
                                <a :href="'#question' + number">{{ value }}</a>
                            </li>
                        </ul>
                    </div>
                    <div><strong>{{ errors.type }}</strong></div>
                </div>
            </div>
            <div class="form-group" :class="{'has-error': errors.score}">
                <label class="control-label col-md-1">分值</label>
                <div class="col-md-2 col-sm-11">
                    <input type="number" class="form-control" v-model="score">
                    <div class="help-block"><strong>{{ errors.score }}</strong></div>
                </div>
            </div>
            <div class="form-group" :class="{'has-error': errors.options || errors.answer}">
                <label class="control-label col-md-1">选项</label>
                <div class="col-md-11 options">
                    <div class="option" :class="{ checkbox: type === 'multi', radio: type === 'single' }" v-if="type" v-for="(item, n) in options">
                        <label>
                            <input v-if="type === 'multi'" type="checkbox" :value="n" v-model="answer" :name="'q' + number">
                            <input v-if="type === 'single'" type="radio" :value="n" v-model="answer" :name="'q' + number">
                            {{ item.value }}
                        </label>
                        <div class="operations pull-right">
                            <span class="glyphicon glyphicon-arrow-up" @click="optionUp(n)"></span>
                            <span class="glyphicon glyphicon-arrow-down" @click="optionDown(n)"></span>
                            <span class="glyphicon glyphicon-edit" @click="editOption(item)" v-if="!item.editing"></span>
                            <span class="glyphicon glyphicon-trash" @click="removeOption(n)"></span>
                        </div>
                        <div v-if="item.editing" class="edit-option">
                            <input type="text" v-model="item.tempText" class="form-control input-gap">
                            <button class="btn btn-primary" @click="saveOption(item)">保存</button>
                            <button class="btn btn-default" @click="cancelEdit(item)">取消</button>
                        </div>
                    </div>
                    <div class="help-block">
                        {{ errors.answer }}
                    </div>
                    <div>
                        <input type="text" v-model="tempOption" class="form-control input-gap">
                        <div class="help-block">
                            {{ errors.options }}
                        </div>
                        <button class="btn btn-primary" @click="addOption">添加</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-footer">
        <div class="col-md-offset-11">
            <button class="btn btn-primary" @click="saveQuestion">保存</button>
        </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            number: Number,
            pQuestion: String,
            pType: String,
            pScore: Number,
            pOptions: Array,
            pAnswer: [String, Array, Number],
        },
        data() {
            let answer;
            if (typeof this.pAnswer === 'string') {
                answer = parseInt(this.pAnswer, 10);
            } else {
                answer = this.pAnswer;
            }

            let options = [];
            if (this.pOptions) {
                options = this.pOptions.map((item, index) => ({
                    value: item,
                    editing: false,
                    tempText: null,
                }))
            }

            return {
                question: this.pQuestion,
                type: this.pType ? this.pType : 'single',
                options: this.pOptions ? this.pOptions : [],
                score: this.pScore !== undefined ? this.pScore : 5,
                answer,
                typeOptions: {
                    single: '单选题',
                    multi: '多选题',
                },
                tempOption: null,
                errors: [],
            }
        },
        methods: {
            onTypeSelect(event) {
                this.type = event.srcElement.parentElement.getAttribute('value');
                if (this.type === 'single') {
                    if (Array.isArray(this.answer) && this.answer.length > 0) {
                        this.answer = this.answer[0];
                    }
                } else if (this.type === 'multi') {
                    if (typeof this.answer === 'number') {
                        this.answer = [this.answer];
                    } else {
                        this.answer = [];
                    }
                }
            },
            addOption() {
                this.options.push({ value: this.tempOption, editing: false });
                this.tempOption = null;
            },
            removeOption(index) {
                this.options.splice(index, 1);
                if (this.type === 'single' && this.answer === index) {
                    this.answer = undefined;
                } else if (this.type === 'multi') {
                    let n = this.answer.indexOf(index);
                    if (n) {
                        this.answer.splice(n, 1);
                        for (let i = 0; i < this.answer.length; i++) {
                            if (this.answer[i] > index) {
                                this.answer[i]--;
                            }
                        }
                    }
                }
            },
            optionUp(index) {
                if (index === 0) {
                    return;
                }
                let temp = this.options[index];
                this.$set(this.options, index, this.options[index - 1]);
                this.$set(this.options, index - 1, temp);
                if (this.type === 'single') {
                    if (this.answer === index) {
                        this.answer = index - 1;
                    } else if (this.answer === index - 1) {
                        this.answer = index;
                    }
                } else if (this.type === 'multi') {
                    let downChecked = this.answer.indexOf(index);
                    let upChecked = this.answer.indexOf(index - 1);
                    if (downChecked >= 0 && upChecked < 0) {
                        this.$set(this.answer, downChecked, index - 1);
                    } else if (downChecked < 0 && upChecked >= 0) {
                        this.$set(this.answer, upChecked, index);
                    }
                }
            },
            optionDown(index) {
                if (index === this.options.length - 1) {
                    return;
                }
                let temp = this.options[index];
                this.$set(this.options, index, this.options[index + 1]);
                this.$set(this.options, index + 1, temp);
                if (this.type === 'single') {
                    if (this.answer === index) {
                        this.answer = index + 1;
                    } else if (this.answer === index + 1) {
                        this.answer = index;
                    }
                } else if (this.type === 'multi') {
                    let upChecked = this.answer.indexOf(index);
                    let downChecked = this.answer.indexOf(index + 1);
                    if (upChecked >= 0 && downChecked < 0) {
                        this.$set(this.answer, upChecked, index + 1);
                    } else if (upChecked < 0 && downChecked >= 0) {
                        this.$set(this.answer, downChecked, index);
                    }
                }
            },
            saveOption(option) {
                option.value = option.tempText;
                option.tempText = null;
                option.editing = false;
            },
            editOption(option) {
                option.tempText = option.value;
                option.editing = true;
            },
            cancelEdit(option) {
                option.tempText = null;
                option.editing = false;
            },
            validate() {
                this.errors = {};
                if (!this.question || this.question.length === 0) {
                    this.errors.question = '题目不能为空';
                }
                if (!this.type) {
                    this.errors.type = '请选择题目类型';
                }
                let score = parseInt(this.score, 10);
                if (!score || score < 0) {
                    this.errors.score = '请输入一个大于0的整数';
                }

                if (this.options.length === 0) {
                    this.errors.options = '请添加一个选项';
                }

                if (this.type === 'single') {
                    if (typeof this.answer !== 'number') {
                        this.errors.answer = '请选择一个正确答案';
                    }
                } else if (this.type === 'multi') {
                    if (this.answer.length === 0) {
                        this.errors.answer = '请选择一个正确答案';
                    }
                }
                return this.errors;
            },
            saveQuestion() {
                this.validate();
                if (this.errors.length !== 0) {
                    return;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .wrapper {
        max-width: 800px;
        margin: 0 auto;
    }
    .options {
        & > div {
            margin-bottom: 8px;
        }
    }
    .edit-option {
        padding-left: 20px;
    }
    .input-gap {
        margin: 8px 0;
    }
    .type-dropdown > div {
        display: inline-block;
    }
</style>