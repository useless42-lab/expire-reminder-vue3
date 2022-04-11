<template>
    <div class="nav hidden-sm-and-up">
        <router-link class="nav-link-item" to="/overview/list">
            <div class="mobile-navbar-item">
                <span class="mdi mdi-package-variant-closed" style="font-size:2em;"></span>
                <div>物品</div>
            </div>
        </router-link>
        <router-link class="nav-link-item" to="/overview/calendar">
            <div class="mobile-navbar-item">
                <span class="mdi mdi-calendar-outline" style="font-size:2em;"></span>
                <div>日历</div>
            </div>
        </router-link>
        <router-link class="nav-link-item" to="/user/overview">
            <div class="mobile-navbar-item">
                <span class="mdi mdi-account" style="font-size:2em;"></span>
                <div>我的</div>
            </div>
        </router-link>
    </div>
</template>

<style>
    .mobile-navbar-item {
        text-align: center;
        color: black;
        font-size: 0.5em;
    }

    .mobile-navbar-item img {
        width: 18px;
    }
</style>