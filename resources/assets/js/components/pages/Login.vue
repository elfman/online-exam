<template>
    <div class="container">
        <div class="login">
            <el-tabs v-model="tab">
                <el-tab-pane label="登录" name="login">
                    <el-form label-width="65px" class="form" ref="login" :model="login" :rules="loginRules">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="login.email"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="login.password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="remember" class="remember">
                            <el-checkbox v-model="login.remember">记住密码</el-checkbox>
                        </el-form-item>
                        <div class="operations" prop="remember">
                            <div class="submit">
                                <el-button type="primary" @click="onLogin">登录</el-button>
                            </div>
                        </div>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="注册" name="register">
                    <el-form label-width="65px" class="form" ref="register" :model="register" :rules="registerRules">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="register.name"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="register.email"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="register.password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="重复" prop="passwordConfirm">
                            <el-input v-model="register.passwordConfirm" type="password"></el-input>
                        </el-form-item>
                        <el-form-item prop="service" label="" class="service" v-if="false">
                            <el-checkbox v-model="register.service" prop="service">同意服务条款</el-checkbox>
                        </el-form-item>
                        <div class="operations">
                            <div class="submit">
                                <el-button type="primary" @click="onRegister">注册</el-button>
                            </div>
                        </div>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import Navbar from '../user/Navbar.vue';
    import axios from 'axios';
    export default {
        components: {
            Navbar,
        },
        data() {
            let validatePass = (rule, value, callback) => {
                if (this.register.passwordConfirm.length > 0) {
                    this.$refs.register.validateField('passwordConfirm');
                }
            };
            let validatePass2 = (rule, value, callback) => {
                if (value !== this.register.password) {
                    callback(new Error('两次输入的密码不一致！'));
                } else {
                    callback();
                }
            };
            let registerRules = {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入有效的email地址', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, message: '用户名至少3个字符', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '密码至少6个字符', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' },
                ],
                passwordConfirm: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator: validatePass2, trigger: 'blur' },
                ],
//                service: [
//                    { type: 'boolean', required: true, message: '必须同意服务条款才能注册', trigger: 'change' },
//                ],

            };
            let loginRules = {
                email: registerRules.email,
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ]
            };

            return {
                loginRules,
                registerRules,
                login: {
                    email: '',
                    password: '',
                    remember: false,
                },
                register: {
                    name: '',
                    email: '',
                    password: '',
                    passwordConfirm: '',
                    service: false,
                },
                tab: 'login',
            };
        },
        methods: {
            onLogin() {
                this.$refs.login.validate(valid => {
                    if (valid) {
                        this.$store.dispatch('login', this.login);
                    }
                });
            },
            onRegister() {
                this.$refs.register.validate(valid => {
                    if (valid) {
                        this.$store.dispatch('register', this.register);
                    }
                });
            }
        }
    }
</script>

<style>
    .el-tabs__item {
        font-size: 17px;
    }
</style>

<style lang="scss" scoped>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .el-header {
        padding: 0 10px;
    }
    .login {
        margin-top: 60px;
        width: 300px;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 0 10px #cccccc;
    }
    .form {
        margin-top: 5px;
        margin-right: 18px;
    }
    .remember, .service {
        margin: -18px 0 0;

    }
    .operations {
        margin-left: 65px;
    }
</style>
