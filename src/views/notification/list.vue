<template>
    <el-form :label-position="'top'" label-width="100px" :model="form" style="max-width: 460px">
         <el-form-item label="提醒方式">
             <el-radio-group v-model="targetNotificationType">
      <el-radio-button label="1">Email</el-radio-button>
      <el-radio-button label="2">Bark</el-radio-button>
      <el-radio-button label="3">Server酱</el-radio-button>
    </el-radio-group>
        </el-form-item>
        <el-form-item label="Email">
            <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="Bark">
            <el-input v-model="form.bark" :placeholder="'https://api.day.app/TOKEN/{{title}}/{{message}}'"></el-input>
        </el-form-item>
        <el-form-item label="Server酱">
            <el-input v-model="form.serverChan"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button style="width:100%;" type="primary" @click="updateDetail">确认</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import notificationApi from '@/service/notification';
export default {
    data() {
        return {
            targetNotificationType:1,
            form:{
                email:"",
                bark:"",
                serveChan:"",
            }
        }
    },
    methods:{
        getDetail(){
            notificationApi.getService()
            .then(res=>{
                this.form.email=res['data']['email'];
                this.form.bark=res['data']['bark'];
                this.form.serverChan=res['data']['server_chan'];
                this.targetNotificationType=res['data']['notification_target'];
            })
        },
        updateDetail(){
            const formData=new FormData();
            formData.append("notification_target",this.targetNotificationType);
            formData.append("email",this.form.email);
            formData.append("bark",this.form.bark);
            formData.append("server_chan",this.form.serverChan);
            notificationApi.updateService(formData)
            .then(()=>{
                this.getDetail();
            })
        }
    },
    mounted(){
        this.getDetail();
    }
}
</script>