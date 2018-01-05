<template>
    <div>
        <div v-if="!editing" class="normal">
            <div class="operations">
                <i class="el-icon-arrow-up" @click="questionUp"></i>
                <i class="el-icon-arrow-down" @click="questionDown"></i>
                <i class="el-icon-edit" @click="editQuestion"></i>
                <i class="el-icon-delete" @click="removeQuestion"></i>
            </div>
            <p>{{ id + 1 }}. {{ question.title }} ({{ question.score }}分)</p>
            <el-radio-group v-if="question.type === 'single'" v-model="question.answer">
                <el-radio v-for="(option, num) in question.options" :name="`radio${id}`" :label="num" disabled :key="num">
                    {{ option }}
                </el-radio>
            </el-radio-group>
            <el-checkbox-group v-if="question.type === 'multi'" v-model="question.answer">
                <el-checkbox v-for="(option, num) in question.options" :name="`checkbox${id}`" :label="num" disabled :key="num">
                    {{ option }}
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <el-card v-if="editing" class="editor">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules" size="small">
                <el-form-item label="题目" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择题目类型">
                        <el-option label="单选题" value="single"></el-option>
                        <el-option label="多选题" value="multi"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分数" prop="score">
                    <el-input v-model="form.score"></el-input>
                </el-form-item>
                <el-form-item label="选项" prop="options">
                    <el-checkbox-group v-if="form.options.length > 0 && form.type === 'multi'" v-model="form.answer.multi" style="width: 100%;">
                        <div v-for="(item, index) in form.options" :key="item.value">
                            <el-checkbox
                                    name="single"
                                    :label="index"
                            >{{ item.value }}</el-checkbox>
                            <div class="operations">
                                <i class="el-icon-arrow-up" @click="optionUp(index)"></i>
                                <i class="el-icon-arrow-down" @click="optionDown(index)"></i>
                                <i class="el-icon-edit" @click="editOption(index)"></i>
                                <i class="el-icon-delete" @click="removeOption(index)"></i>
                            </div>
                            <div v-if="item.editing">
                                <el-input v-model="item.tempText"></el-input>
                                <el-button type="primary" @click="saveOption" size="small" style="margin-top: 6px;">保存</el-button>
                            </div>
                        </div>
                    </el-checkbox-group>
                    <el-radio-group v-if="form.options.length > 0 && form.type === 'single'" v-model="form.answer.single" style="width: 100%;">
                        <div v-for="(item, index) in form.options" :key="item.value">
                            <el-radio
                                    :label="index"
                                    name="multi"
                            >{{ item.value }}</el-radio>
                            <div class="operations">
                                <i class="el-icon-arrow-up" @click="optionUp(index)"></i>
                                <i class="el-icon-arrow-down" @click="optionDown(index)"></i>
                                <i class="el-icon-edit" @click="editOption(index)" v-if="!item.editing"></i>
                                <i class="el-icon-delete" @click="removeOption(index)"></i>
                            </div>
                            <div v-if="item.editing">
                                <el-input v-model="item.tempText"></el-input>
                                <el-button type="primary" @click="saveOption" size="small" style="margin: 6px 0;">保存</el-button>
                            </div>
                        </div>
                    </el-radio-group>
                    <el-input v-model="tempOption" placeholder="新选项"></el-input>
                    <el-button type="primary" @click="addOption" style="margin-top: 12px;">添加</el-button>
                </el-form-item>
                <el-row>
                    <el-col :offset="20" :span="4">
                        <el-button @click="cancel">取消</el-button>
                        <el-button type="primary" @click="save">保存</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    export default {
        props: {
            question: Object,
            answer: [Number, Array],
            edit: Boolean,
            id: Number,
        },
        data() {
            let options = [];
            let answer = {
                multi: [],
                single: null,
            };
            if (this.question) {
                options = this.question.options.map((item, index) => ({
                    value: item,
                    editing: false,
                    tempText: null,
                }));

                answer[this.question.type] = this.question.answer;
            }
            let validateScore = (role, value, callback) => {
                let reg = /^[0-9]*[1-9][0-9]*$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入一个大于0的整数'));
                } else {
                    callback();
                }
            };
            let validateOptions = (rule, value, callback) => {
                if (this.form.options.length === 0) {
                    callback(new Error('请提供答案选项'));
                    return;
                }

                let type = this.form.type;
                let answer = this.form.answer;
                if ((type ==='single' && typeof answer.single !== 'number')
                    || (type === 'multi' && answer.multi.length === 0)) {
                    callback(new Error('请选择答案'));
                } else {
                    callback();
                }
            };
            return {
                form: {
                    title: this.question ? this.question.title : '',
                    type: this.question ? this.question.type : 'single',
                    score: this.question ? this.question.score : 5,
                    options,
                    answer,
                },
                rules: {
                    title: [
                        { required: true, message: '请输入题目', trigger: 'blur' },
                    ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'change' },
                    ],
                    score: [
                        { required: true, message: '请输入分数', trigger: 'blur' },
                        { validator: validateScore, trigger: 'blur' },
                    ],
                    options: [
                        { validator: validateOptions, trigger: 'submit' },
                    ],
                },
                typeOptions: {
                    single: '单选题',
                    multi: '多选题',
                },
                tempOption: null,
                editing: this.edit,
            }
        },
        methods: {
            addOption() {
                if (!this.tempOption || this.tempOption.length === 0) {
                    return;
                }
                this.form.options.push({ value: this.tempOption, editing: false });
                this.tempOption = '';
            },
            removeOption(index) {
                this.form.options.splice(index, 1);

                let multi= this.form.answer.multi;

                let n = multi.indexOf(index);
                if (n >= 0) {
                    multi.splice(n, 1);
                    for (let i = 0; i < multi.length; i++) {
                        let option = multi[i];
                        if (option > index) {
                            multi[i] = option - 1;
                        }
                    }
                }

                if (this.form.answer.single === index) {
                    this.form.answer.single = null;
                } else if (this.form.answer.single > index) {
                    this.form.answer.single--;
                }
            },
            editOption(index) {
                let item = this.form.options[index];
                item.editing = true;
                item.tempText = item.value;
            },
            saveOption(item) {
                item.editing = false;
                item.value = item.tempText;
            },
            optionUp(index) {
                if (index <= 0) {
                    return;
                }
                let options = this.form.options;
                let multi = this.form.answer.multi;
                let temp = options[index];

                this.$set(options, index, options[index - 1]);
                this.$set(options, index - 1, temp);

                let upChecked = multi.indexOf(index - 1);
                let downChecked = multi.indexOf(index);
                if (downChecked >= 0 && upChecked < 0) {
                    this.$set(multi, downChecked, index - 1);
                } else if (downChecked < 0 && upChecked >= 0) {
                    this.$set(multi, upChecked, index);
                }

                if (this.form.answer.single === index) {
                    this.form.answer.single = index - 1;
                } else if (this.form.answer.single === index - 1) {
                    this.form.answer.single = index;
                }
            },
            optionDown(index) {
                if (index >= this.form.options.length - 1) {
                    return;
                }

                let options = this.form.options;
                let multi = this.form.answer.multi;
                let temp = options[index];

                this.$set(options, index, options[index + 1]);
                this.$set(options, index + 1, temp);

                let upChecked = multi.indexOf(index);
                let downChecked = multi.indexOf(index + 1);
                if (downChecked >= 0 && upChecked < 0) {
                    this.$set(multi, downChecked, index);
                } else if (downChecked < 0 && upChecked >= 0) {
                    this.$set(multi, upChecked, index + 1);
                }

                if (this.form.answer.single === index) {
                    this.form.answer.single = index + 1;
                } else if (this.form.answer.single === index + 1) {
                    this.form.answer.single = index;
                }

            },
            save() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        if (this.question) {
                            this.$emit('save', this.id, {
                                title: this.form.title,
                                type: this.form.type,
                                score: this.form.score,
                                options: this.form.options.map(item => item.value),
                                answer: this.form.answer[this.form.type],
                            });
                            this.editing = false;
                        } else {
                            this.$emit('create', {
                                title: this.form.title,
                                type: this.form.type,
                                score: this.form.score,
                                options: this.form.options.map(item => item.value),
                                answer: this.form.answer[this.form.type],
                            });
                            this.reset();
                        }
                    } else {
                        console.log('error');
                        return false;
                    }
                })
            },
            cancel() {
                if (typeof this.id === 'number') {
                    this.editing = false;
                } else {
                    this.reset();
                    this.$emit('cancel');
                }
            },
            reset() {
                this.form = {
                    title: '',
                    type: 'single',
                    score: 5,
                    options: [],
                    answer: {
                        single: null,
                        multi: [],
                    }
                };
                this.tempOption = '';
            },
            questionUp() {
                this.$emit('up', this.id);
            },
            questionDown() {
                this.$emit('down', this.id);
            },
            editQuestion() {
                this.editing = true;
            },
            removeQuestion() {
                this.$emit('remove', this.id);
            },
        },
        watch: {
            question: function(val) {
                this.form = {
                    title: val.title,
                    type: val.type,
                    score: val.score,
                    options: val.options.map(item => ({
                        value: item,
                        editing: false,
                        tempText: null,
                    })),
                    answer: {
                        single: val.type === 'single' ? val.answer : null,
                        multi: val.type === 'multi' ? val.answer : [],
                    },
                }
            },
            edit: function (val) {
                this.editing = val;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .normal {
        padding: 8px;
        border-radius: 8px;
        border: 1px transparent solid;
        &:hover {
            border-color: #409eff;
            box-shadow: 0 0 15px #409eff;
        }
    }
    label.el-radio, label.el-checkbox {
        display: block;
        margin-left: 0 !important;
        line-height: 20px;

        .editor & {
            display: inline-block;
            line-height: 25px;
        }

        &:not(:first-child) {
            margin-top: 10px;
        }
    }
    .operations {
        display: inline-block;
        font-size: 15px;
        line-height: 25px;
        float: right;
        i {
            margin-left: 6px;
        }
    }
</style>