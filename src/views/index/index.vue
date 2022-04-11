<template>
    <el-row>
        <el-col :span="12" :xs="24">
            <div
                style="width:100%;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                <div style="font-size:2em;font-weight:bolder;">
                    临期提醒
                </div>
                <div style="margin-top:10px;font-size:1.5em;">轻量 无需下载 网页即可使用</div>
                <div style="margin-top:30px;">
                    <el-button type="primary" @click="navigateToLogin">使用</el-button>
                </div>
            </div>
        </el-col>
        <el-col :span="12" :xs="24">
            <div>
                <el-carousel height="100vh">
                    <el-carousel-item>
                        <img style="width:100%;" src="https://common-1251767676.cos.ap-guangzhou.myqcloud.com/expire-reminder%2F1.jpg" alt="">
                    </el-carousel-item>
                    <el-carousel-item>
                        <img style="width:100%;" src="https://common-1251767676.cos.ap-guangzhou.myqcloud.com/expire-reminder%2F2.jpg" alt="">
                    </el-carousel-item>
                    <el-carousel-item>
                        <img style="width:100%;" src="https://common-1251767676.cos.ap-guangzhou.myqcloud.com/expire-reminder%2F3.jpg" alt="">
                    </el-carousel-item>
                </el-carousel>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        methods: {
            navigateToLogin() {
                this.$router.push("/auth/login");
            }
        }
    }
</script>