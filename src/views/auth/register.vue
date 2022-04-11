<template>
    <div>
        <el-form label-position="top" style="width:300px;">
            <el-form-item label="用户名">
                <el-input v-model="authForm.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="authForm.email"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="authForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="验证码">
                <el-row :gutter="10">
                    <el-col :span="16">
                        <el-input v-model="authForm.captcha"></el-input>
                    </el-col>
                    <el-col :span="8">
                        <img @click="getCaptcha()" :src="captchaDetail.data" alt="" style="width:100px;height: 32px;">
                    </el-col>
                </el-row>
            </el-form-item>
            <el-button type="primary" :loading="isLoading" style="width: 100%;" @click="onRegister()">注册</el-button>
            <el-button type="text" @click="navigateToLogin()">前往登录</el-button>
        </el-form>
    </div>
</template>

<script>
    import authApi from '../../service/auth';
    import {ElMessage} from 'element-plus';

    export default {
        data() {
            return {
                authForm: {
                    username: "",
                    email: "",
                    password: "",
                    captcha: "",
                },
                isLoading: false,
                captchaDetail: '',
            }
        },
        methods: {
            navigateToLogin() {
                this.$router.push("/auth/login")
            },
            onRegister() {
                this.isLoading = true;
                const formData = new FormData();
                formData.append("email", this.authForm.email);
                formData.append("username", this.authForm.username);
                formData.append("password", this.authForm.password);
                formData.append("captcha", this.authForm.captcha);
                formData.append("captcha_id", this.captchaDetail.captchaId);
                authApi.registerService(formData)
                    .then(res => {
                        if (res['code'] == 200) {
                            this.$router.push('/auth/login');
                        } else {
                            ElMessage.error(res['error'])
                            this.getCaptcha();
                        }
                        this.isLoading = false;
                    })
            },
            getCaptcha() {
                authApi.getCaptchaService()
                    .then(res => {
                        if (res['code'] == 200) {
                            this.captchaDetail = res['data'];
                        }
                    })
            }
        },
        mounted() {
            this.getCaptcha();
            this.authForm.username = this.$route.query.username;
        }
    }
</script>