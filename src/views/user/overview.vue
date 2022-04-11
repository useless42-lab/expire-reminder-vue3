<template>
    <div style="text-align:center;margin-top:30px;">
        <el-avatar :size="50" :src="circleUrl" />
        <div>{{detail.username}}</div>
        <div style="font-size:0.9em;color:#999;">{{detail.name}}</div>
    </div>
    <div class="container" style="margin-top:10px">
        <router-link class="nav-link-item" to="/manage/team/list">
            <div class="nav-list-item">
                <span class="mdi mdi-family-tree"></span>
                <div>空间</div>
            </div>
        </router-link>
        <router-link class="nav-link-item" to="/manage/notification/list">
            <div class="nav-list-item">
                <span class="mdi mdi-bell-outline"></span>
                <div>提醒</div>
            </div>
        </router-link>
        <router-link class="nav-link-item" to="/manage/subscribe/list">
            <div class="nav-list-item">
                <span class="mdi mdi-wallet-outline"></span>
                <div>订阅</div>
            </div>
        </router-link>
        <div class="nav-list-item" style="border-bottom: none;" @click="logout()">
            <span class="mdi mdi-logout"></span>
            <div>登出</div>
        </div>
    </div>
    <MobileNavbar></MobileNavbar>
</template>
<script>
    import MobileNavbar from '@/components/MobileNavbar.vue';
    import planApi from '@/service/plan';
    export default {
        components: {
            MobileNavbar,
        },
        data() {
            return {
                circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
                detail: [],
            }
        },
        methods: {
            logout(){
                localStorage.clear();
                this.$router.push("/auth/login");
            },
            getDetail() {
                planApi.getUserPlanService()
                    .then(res => {
                        this.detail = res['data'];
                    })
            }
        },
        mounted() {
            this.getDetail();
        }
    }
</script>

<style>
    .nav-list-item {
        display: flex;
        align-items: center;
        color: black;
        padding: 15px 0px;
        border-bottom: 1px solid #ccc;
    }

    .nav-list-item span {
        margin-right: 10px;
    }
</style>