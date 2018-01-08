<template>
    <div class="container">
        <el-form label-width="80px">
            <el-form-item label="用户名">
                <el-input v-model="username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="email"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
                <el-input v-model="passwordConfirm"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                email: '',
                password: '',
                passwordConfirm: '',
            };
        }
    }
</script>

<style lang="scss" scoped>

</style>