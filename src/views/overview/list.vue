<template>
<OverviewHeadBar></OverviewHeadBar>
    <div class="container" style="margin-top:20px;margin-bottom:88px;">
        <div v-for="item,index in overviewList" :key="index">
            <div
                style="margin-bottom:10px;margin-top:10px;display:flex;align-items:center;justify-content:space-between;">
                <div>{{item.name}}</div>
                <span class="mdi mdi-plus" style="padding:3px;font-size:1.3em;" @click="openAddDialog(item.id)"></span>
            </div>
            <el-row :gutter="20" @click="navigateToGoodsList(item.id)">
                <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
                    <div class="overview-card" shadow="never">
                        <div>全部</div>
                        <div class="overview-number">{{item.goods_overview_number.all}}</div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
                    <div class="overview-card" shadow="never">
                        <div>未过期</div>
                        <div class="overview-number">{{item.goods_overview_number.active}}</div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
                    <div class="overview-card" shadow="never">
                        <div>已过期</div>
                        <div class="overview-number" style="color:red;">{{item.goods_overview_number.expired}}</div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
                    <div class="overview-card" shadow="never">
                        <div>已处理</div>
                        <div class="overview-number" style="color:#999">{{item.goods_overview_number.thrown}}</div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
    <MobileNavbar></MobileNavbar>
    <el-dialog v-model="addDialogVisible" fullscreen title="创建物品" width="300px">
        <el-form :model="form">
            <div id="reader" width="600px" class="hidden-md-and-up" style="margin-bottom:15px;"></div>
            <el-row>
                <el-col :span="16" :xs="24">
                    <el-form-item label="条形码：">
                        <el-input v-model="form.barcode" autocomplete="off" placeholder="条形码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :xs="24">
                    <el-form-item label-width="68px">
                        <el-button class="button" style="width:100%;" @click="getGoodsName(form.barcode)">获取名称
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item label="物品分组">
                <el-select v-model="targetGroup" class="m-2" placeholder="请选择" @change="changeGroup">
                    <el-option v-for="item,index in groupList" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="物品分类">
                <el-select v-model="form.category" class="m-2" placeholder="请选择分类">
                    <el-option v-for="item in tabGoodsCategory" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="物品名称">
                <el-input v-model="form.name" autocomplete="off" placeholder="名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="物品价格">
                <el-input-number v-model="form.price" :precision="2" :step="1" />
                <span style="margin-left:5px;">元</span>
            </el-form-item>
            <el-form-item label="物品数量">
                <el-input-number v-model="form.number" :min="1" :max="10" />
            </el-form-item>
            <el-form-item label="物品标签">
                <el-select v-model="form.tags" multiple filterable allow-create default-first-option
                    :reserve-keyword="false" placeholder="请选择或输入你的标签">
                    <el-option v-for="item in tagList" :key="item.name" :label="item.name" :value="item.name" />
                </el-select>
            </el-form-item>
            <el-form-item label="物品备注">
                <el-input v-model="form.remarks" :rows="2" type="textarea" placeholder="备注" />
            </el-form-item>
            <el-form-item label="生产日期">
                <el-date-picker v-model="form.productTime" type="date" placeholder="选择生产日期"
                    value-format="YYYY/MM/DD 00:00:00" @change="calculateExpireDate">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="保质期限">
                <el-input-number style="margin-right:10px;" @change="calculateExpireDate" v-model="form.shelfLife"
                    :min="1" />
                <el-radio @change="calculateExpireDate" v-model="form.shelfLifeType" label="1">天</el-radio>
                <el-radio @change="calculateExpireDate" v-model="form.shelfLifeType" label="2">月</el-radio>
            </el-form-item>
            <el-form-item label="过期日期">
                <el-date-picker v-model="form.expireTime" type="date" placeholder="过期日期"
                    value-format="YYYY/MM/DD 00:00:00">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="提前几天">
                <el-input-number style="margin-right:10px;" v-model="form.advanceDay" :min="1" :max="10" />天提醒
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" style="width:100%;" @click="confirmGoods()">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
    import {
        ElMessage
    } from 'element-plus';
    import dayjs from 'dayjs';
    import goodsApi from '@/service/goods';
    import tagApi from '@/service/tag';
    import MobileNavbar from '@/components/MobileNavbar.vue';
    import OverviewHeadBar from '@/components/OverviewHeadBar.vue';
    import teamApi from '@/service/team';
    import {
        Html5QrcodeScanner
    } from "html5-qrcode";
    import {
        goodsCategoryData
    } from '@/utils/config';
    import groupApi from '@/service/group';
    export default {
        components: {
            MobileNavbar,
            OverviewHeadBar
        },
        data() {
            return {
                goodsCategory: goodsCategoryData,
                tabGoodsCategory: goodsCategoryData,
                targetTeam: "",
                targetGroup: "",
                targetTag: "",
                overviewList: [],
                groupList: [],
                addDialogVisible: false,
                form: {
                    barcode: "",
                    name: "",
                    price: 0.00,
                    number: 1,
                    tags: "",
                    remarks: "",
                    category: 1,
                    productTime: "",
                    shelfLife: "",
                    shelfLifeType: "1",
                    expireTime: "",
                    advanceDay: "",
                },
                tagList: [],
            }
        },
        methods: {
            openAddDialog(teamId) {
                this.targetTeam = teamId;
                groupApi.getListService(teamId)
                    .then(res => {
                        this.groupList = res['data'];
                        this.targetGroup = this.groupList[0].id;
                        tagApi.getListService(this.targetTeam, this.targetGroup)
                            .then(res => {
                                this.tagList = res['data'];
                            })
                    })
                let canUseBarCode = true;
                if (!('BarcodeDetector' in window)) {
                    console.log('此浏览器不支持条形码检测器。');
                    canUseBarCode = false;
                } else {
                    console.log('支持条形码检测器！');
                    canUseBarCode = true;
                }
                var that = this;
                this.addDialogVisible = true;
                setTimeout(function () {
                    console.log("canUseBarCode", canUseBarCode)
                    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
                        // safely access `navigator.mediaDevices.getUserMedia`
                        let html5QrcodeScanner = new Html5QrcodeScanner(
                            "reader", {
                                fps: 10,
                                qrbox: {
                                    width: 250,
                                    height: 250
                                },
                                experimentalFeatures: {
                                    useBarCodeDetectorIfSupported: canUseBarCode
                                }
                            },
                            /* verbose= */
                            false);
                        html5QrcodeScanner.render(that.onScanSuccess, that.onScanFailure);
                    } else {
                        console.log("12313123")
                    }
                }, 500);
            },

            confirmGoods() {
                console.log(this.form.tags)
                const formData = new FormData();
                formData.append("barcode", this.form.barcode);
                formData.append("number", this.form.number);
                formData.append("team_id", this.targetTeam);
                formData.append("group_id", this.targetGroup);
                formData.append("name", this.form.name);
                formData.append("price", this.form.price);
                formData.append("tags", this.form.tags);
                formData.append("remarks", this.form.remarks);
                formData.append("category", this.form.category);
                formData.append("product_time", this.form.productTime.replace(/\//g, "-"));
                if (this.form.shelfLifeType == 2) {
                    formData.append("shelf_life", this.form.shelfLife * 30);
                } else {
                    formData.append("shelf_life", this.form.shelfLife);
                }
                formData.append("expire_time", this.form.expireTime.replace(/\//g, "-"));
                formData.append("advance_day", this.form.advanceDay);
                goodsApi.addService(formData)
                    .then(res => {
                        if (res['code'] == 200) {
                            ElMessage.success("添加成功");
                        } else {
                            ElMessage.error(res['error']);
                        }
                        this.addDialogVisible = false;
                        this.getOverviewList();
                    })
            },
            calculateExpireDate() {
                let expireDate = new Date(this.form.productTime)
                if (this.form.shelfLifeType == 2) {
                    expireDate.setDate(expireDate.getDate() + 30 * this.form.shelfLife)
                } else {
                    expireDate.setDate(expireDate.getDate() + this.form.shelfLife)
                }
                this.form.expireTime = dayjs(expireDate).format("YYYY-MM-DD 00:00:00");
            },
            onScanSuccess(decodedText, decodedResult) {
                console.log(`Code matched = ${decodedText}`, decodedResult);
                this.form.barcode = decodedText;
                this.getGoodsName(this.form.barcode);
            },
            getGoodsName(barcode) {
                goodsApi.getGoodsNameService(barcode)
                    .then(res => {
                        this.form.name = res['data'];
                    })
            },
            getOverviewList() {
                teamApi.GetOverviewTeamService()
                    .then(res => {
                        this.overviewList = res['data'];
                    })
            },
            navigateToGoodsList(id) {
                this.$router.push(`/user/goods/list?team=${id}`)
            },
            navigateToCalendar(){
                this.$router.push(`/overview/calendar`);
            }
        },
        mounted() {
            this.getOverviewList();
        }
    }
</script>
<style>
    .overview-card {
        margin-bottom: 10px;
        font-size: 1em;
        padding: 10px;
        border: solid 1px #e4e7ed;
        border-radius: 4px;
    }

    .overview-number {
        text-align: right;
        font-weight: bolder;
        font-size: 1.1em;
    }
</style>