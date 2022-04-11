<template>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="订阅计划" name="first">
            <el-row :gutter="10">
                <el-col :span="6" :xs="24" v-for="item,index in planList" :key="index">
                    <div class="plan-list-item">
                        <div style="padding:15px;border:solid 1px #2196f3;border-radius: 6px;">
                            <h3 style="margin-bottom:15px;">{{item.name}}</h3>
                        <div class="plan-item">
                            <div class="plan-item-title">工作空间数量</div>
                            <div class="plan-item-content">{{item.team_number}}</div>
                        </div>
                        <div class="plan-item">
                            <div class="plan-item-title">每个空间分组数量</div>
                            <div class="plan-item-content">{{item.per_team_group_limit}}</div>
                        </div>
                        <div class="plan-item">
                            <div class="plan-item-title">每个空间物品数量</div>
                            <div class="plan-item-content">{{item.per_team_goods_limit}}</div>
                        </div>
                        <div class="plan-item">
                            <div class="plan-item-title">每个空间成员数量</div>
                            <div class="plan-item-content">{{item.team_member_limit}}</div>
                        </div>
                        <div v-if="item.status==1" style="margin-top:15px;">
                            <el-button plain type="primary" style="width:100%;"
                                @click="navigateToBuy(item.url_key_year)">
                                年付 {{item.price_year}}￥
                            </el-button>
                        </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="我的订单" name="second">
            <div style="margin:0px 0px 15px 0px;">
                <div>我的计划：{{userPlan.name}}</div>
                <div>过期时间：{{userPlan.expired_at}}</div>
            </div>
            <div style="display:flex;margin-bottom:15px;">
                <el-input placeholder="订单号/优惠码" v-model="orderId"></el-input>
                <el-button style="margin-left:15px;" @click="checkOrder">确认</el-button>
            </div>
            <el-table :data="orderList" style="width: 100%">
                <el-table-column prop="order_id" label="订单编号" />
                <el-table-column prop="status" label="状态" width="180">
                    <template #default="scope">
                        <div>{{ scope.row.status==1?"待发放":"已发放" }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" />
            </el-table>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    import planApi from '@/service/plan';
    import {
        ElMessage
    } from 'element-plus';
    export default {
        data() {
            return {
                activeName: "first",
                orderId: "",
                planList: [],
                orderList: [],
                userPlan: [],
            }
        },
        methods: {
            getUserPlan() {
                planApi.getUserPlanService()
                    .then(res => {
                        this.userPlan = res['data'];
                    })
            },
            getPlanList() {
                planApi.getListService()
                    .then(res => {
                        this.planList = res['data'];
                    })
            },
            getOrderList() {
                planApi.getOrderListService(1, 999)
                    .then(res => {
                        this.orderList = res['data']['data'];
                    })
            },
            navigateToBuy(urlKey) {
                window.open("https://mianbaoduo.com/o/bread/" + urlKey);
            },
            checkOrder() {
                this.isLoading = true;
                this.isDisabled = true;
                const formData = new FormData();
                formData.append("order_id", this.orderId);
                planApi.checkOrderService(formData)
                    .then(res => {
                        if (res['code'] == 200) {
                            ElMessage.success("成功");
                        } else {
                            ElMessage.error(res['error']);
                        }
                        this.isLoading = false;
                        this.isDisabled = false;
                        this.getOrderList();
                    })
            },
        },
        mounted() {
            this.getPlanList();
            this.getOrderList();
            this.getUserPlan();
        }
    }
</script>

<style scoped>
    .plan-list-item {
        text-align: right;
        width: 100%;
        margin-bottom: 10px; 
    }

    .plan-item {}

    .plan-item-title {}

    .plan-item-content {}
</style>