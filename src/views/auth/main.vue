<template>
    <div class="auth-container">
        <h1>临期提醒</h1>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AuthMainView',
});
</script>

<style scoped>
    .auth-container {
        display: flex;
        flex-direction: column;
        min-height: 100%;
        background: #f0f2f5;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .auth-container {
        background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
        background-repeat: no-repeat;
        background-position: center 110px;
        background-size: 100%;
    }
</style>