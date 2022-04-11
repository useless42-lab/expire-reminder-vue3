<template>
    <div class="container" style="margin-top:30px;">
        <el-row :gutter="20">
            <el-col class="hidden-xs-only" :span="6" :xs="24" :sm="6" :md="6" :lg="6" :xl="6"
                style="text-align:center;">
                <el-menu router style="border-right:none;">
                    <el-menu-item index="/overview/list">我的物品</el-menu-item>
                    <el-menu-item index="/manage/team/list">我的空间</el-menu-item>
                    <el-menu-item index="/manage/notification/list">提醒方式</el-menu-item>
                    <el-menu-item index="/manage/subscribe/list">我的订阅</el-menu-item>
                </el-menu>
            </el-col>
            <el-col style="padding-bottom:100px;" :span="18" :xs="24" :sm="18" :md="18" :lg="18" :xl="18">
                <router-view></router-view>
            </el-col>
        </el-row>
        <MobileNavbar></MobileNavbar>
    </div>
</template>
<script lang="ts">
    import MobileNavbar from '@/components/MobileNavbar.vue';
    import 'element-plus/theme-chalk/display.css'
    import {
        defineComponent
    } from 'vue';

    export default defineComponent({
        name: 'AuthMainView',

        components: {
            MobileNavbar,
        },
    });
</script>

<style>
    .nav-link-item {
        text-decoration: none;
        color: #999;
    }

    .nav {
        width: 100%;
        height: 60px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 5;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        box-shadow: 0px -1px 1px #e6e6e6;
        background-color: #fff;
        margin: auto;
        border: 0 solid rgb(210, 210, 210);
        border-top-width: 1px;
        font-size: 20px;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }
</style>