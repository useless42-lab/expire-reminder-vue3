<template>
    <OverviewHeadBar></OverviewHeadBar>
    <div class="container" style="margin-top:20px;margin-bottom:88px;">
        <Calendar ref="calendar" :attributes='attributes' is-expanded @transition-start="toggleMonth">
        </Calendar>
        <div style="margin-top:15px;">
            <div style="margin-top:10px;border-radius:.5rem;border:solid 1px #cbd5e0;padding:10px"
                v-for="item,index in attributes" :key="index" @click="navigateToGoodsList(item.customData.teamId,item.customData.groupId)">
                <div>{{item.customData.teamName}} - {{item.customData.groupName}} - {{item.customData.goodsName}}</div>
                <div style="text-align:right;color:#999;">{{formatDate(item.customData.expireTime)}}</div>
            </div>
        </div>
    </div>
    <MobileNavbar></MobileNavbar>
</template>

<script>
    import dayjs from 'dayjs'
    import MobileNavbar from '@/components/MobileNavbar.vue';
    import OverviewHeadBar from '@/components/OverviewHeadBar.vue';
    import 'v-calendar/dist/style.css';
    import {
        Calendar
    } from 'v-calendar';
    import goodsApi from '@/service/goods';
    export default {
        components: {
            MobileNavbar,
            Calendar,
            OverviewHeadBar
        },
        computed: {
            formatDate() {
                return function (v) {
                    return dayjs(v).format('MM-DD')
                }
            }
        },
        data() {
            return {
                calendar: "",
                date: new Date(),
                attributes: []
            }
        },
        methods: {
            toggleMonth() {
                this.attributes = [];
                console.log(this.calendar.firstPage.year);
                console.log(this.calendar.firstPage.month);
                this.getList(this.calendar.firstPage.year, this.calendar.firstPage.month);
            },
            getList(year, month) {
                goodsApi.getOverviewCalendarService(year, month)
                    .then(res => {
                        console.log(res.data);
                        res.data.forEach(item => {
                            this.attributes.push({
                                dot: "red",
                                dates: item.expire_time,
                                excludeDates: null,
                                order: 0,
                                customData: {
                                    teamId: item.team_id,
                                    groupId:item.group_id,
                                    goodsName: item.goods_name,
                                    teamName: item.team_name,
                                    groupName: item.group_name,
                                    expireTime: item.expire_time,
                                },
                                popover: {
                                    visibility: 'hover',
                                    label: `${item.team_name} - ${item.group_name} - ${item.goods_name}`
                                },
                            })
                        });
                    })
            },
            navigateToGoodsList(teamId,groupId) {
                this.$router.push(`/user/goods/list?team=${teamId}&group=${groupId}`)
            },
        },
        mounted() {
            this.calendar = this.$refs.calendar;
            this.toggleMonth();
        }
    }
</script>