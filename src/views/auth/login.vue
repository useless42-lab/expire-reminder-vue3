<template>
    <div>
        <el-form label-position="top" style="width:300px;">
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
            <el-button type="primary" :loading="isLoading" style="width: 100%;" @click="onLogin()">登录</el-button>
            <el-button type="text" @click="navigateToRegister()">前往注册</el-button>
        </el-form>
    </div>
</template>

<script>
    import authApi from '../../service/auth';
    import {
        ElMessage
    } from 'element-plus';
    export default {
        data() {
            return {
                authForm: {
                    email: "",
                    password: "",
                    captcha: "",
                    captchaId: "",
                },
                isLoading: false,
                captchaDetail: '',
            }
        },
        methods: {
            navigateToRegister() {
                this.$router.push("/auth/register")
            },
            onLogin() {
                this.isLoading = true;
                const formData = new FormData();
                formData.append("email", this.authForm.email);
                formData.append("password", this.authForm.password);
                formData.append("captcha", this.authForm.captcha);
                formData.append("captcha_id", this.captchaDetail.captchaId);

                authApi.loginService(formData)
                    .then(res => {
                        if (res['code'] == 200) {
                            localStorage.setItem("token", res['data']['token']);
                            if (localStorage.getItem("redirect")) {
                                this.$router.push(localStorage.getItem("redirect"))
                                localStorage.removeItem("redirect");
                            } else {
                                this.$router.push('/overview/list');
                            }
                        } else {
                            ElMessage.error(res['error']);
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
            this.getCaptcha()
        }
    }
</script>