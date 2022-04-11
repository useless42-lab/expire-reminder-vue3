<template>
    <div style="display: flex;align-items: center;justify-content: center;height: 100vh;flex-direction: column;">
        <div v-if="info.username!=''" style="display: flex;align-items: center;justify-content: center;flex-direction: column;">
            <img style="width:350px;" src="../../assets/images/invite.png" alt="">
            <div style="margin-bottom:5px;">
                <span style="font-weight: bolder;">{{info.username}}</span> 邀请您加入 <span
                    style="font-weight: bolder;">{{info.name}}</span>
            </div>
            <el-button type="success" @click="onSubmit()" style="margin-top:15px;">确认接受</el-button>
        </div>
        <div v-if="info.username==''" style="display: flex;align-items: center;justify-content: center;flex-direction: column;">
            <img style="width:350px;" src="../../assets/images/404.png" alt="">
            <div style="margin-bottom:15px;">
                <span style="font-weight: bolder;">链接已失效</span>
            </div>
        </div>
    </div>
</template>

<script>
  import teamApi from '@/service/team';
    export default {
        data() {
            return {
                token: "",
                info:{},
                status:"",
            }
        },
        methods: {
            getInfo(token) {
                teamApi.getInviteInfoService(token)
                    .then(res => {
                        this.info=res.data;
                        this.status=res.code;
                    })
            },
            onSubmit(){
                if(this.status!=200){
                    localStorage.setItem("redirect",this.$route.fullPath);
                    this.$router.push(`/auth/login`);
                }else{
                    const formData=new FormData();
                    formData.append("token",this.$route.params.token);
                    teamApi.acceptInviteService(formData)
                    .then(res=>{
                        if(res.code==200){
                            this.$router.push("/overview/list");
                        }
                    })
                }
            }
        },
        mounted() {
            this.token = this.$route.params.token;
            console.log(this.token);
            this.getInfo(this.token);
        },
    }
</script>