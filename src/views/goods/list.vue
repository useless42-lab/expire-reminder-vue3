<template>
    <!-- <div class="container" style="margin-top:30px;">
        <div style="display:flex;align-items:center;">
            <el-input style="margin-right:6px;" v-model="searchStr" placeholder="请输入商品名称" @clear="searchGoods()"
                clearable class="input-with-select">
            </el-input>
            <el-button circle @click="searchGoods()">
                <el-icon>
                    <search />
                </el-icon>
            </el-button>

            <el-button circle @click="openAddDialog()">
                <el-icon>
                    <plus />
                </el-icon>
            </el-button>
            <el-button circle @click="navigateManage()" class="hidden-xs-only">
                <el-icon>
                    <setting />
                </el-icon>
            </el-button>
        </div>
    </div> -->
    <div class="container" style="margin-top:20px;margin-bottom: 88px;">
        <el-row :gutter="20">
            <!-- <el-col :span="8" :xs="12" :sm="8" :md="8" :lg="8" :xl="8">
                <el-select style="width:100%;margin-bottom: 10px;" v-model="targetTeam" class="m-2" placeholder="Select"
                    @change="changeTeam">
                    <el-option v-for="item,index in teamList" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-col> -->
            <el-col :span="12" :xs="10" :sm="12" :md="12" :lg="12" :xl="12">
                <div style="display:flex;align-items:center;margin-bottom: 10px;">
                    <span @click="navigateToHome()" class="mdi mdi-home hidden-xs-only"
                        style="font-size:1.5em;margin-right:11px;"></span>
                    <el-select style="width:100%;" v-model="targetGroup" class="m-2"
                        placeholder="Select" @change="changeGroup">
                        <el-option v-for="item,index in groupList" :key="index" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="12" :xs="14" :sm="12" :md="12" :lg="12" :xl="12">
                <div style="display:flex;align-items:center;margin-bottom: 10px;">
                    <el-select style="width:100%;margin-right:6px;" v-model="targetTag" class="m-2" placeholder="Select"
                        @change="changeTag">
                        <el-option v-for="item,index in baseTagList" :key="index" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <!-- <el-button class="hidden-md-and-up" circle @click="openScanQrcode()">
                        <el-icon>
                            <full-screen />
                        </el-icon>
                    </el-button> -->
                    <!-- <el-button circle @click="openQrcodeDialog()">
                        <el-icon>
                            <place />
                            <span class="mdi mdi-qrcode"></span>
                        </el-icon>
                    </el-button> -->
                    <span @click="openQrcodeDialog()" class="mdi mdi-qrcode"
                        style="font-size:1.5em;margin-left:5px;"></span>
                </div>
            </el-col>
        </el-row>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="clickTab()">
            <el-tab-pane v-for="item,index in goodsCategory" :key="index" :label="item.label" :name="item.value">
                <el-row :gutter="20">
                    <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" v-for="item,index in list" :key="index">
                        <el-card class="box-card" shadow="hover" style="margin-bottom:10px;"
                            @click="openDetailDialog(item.id)">
                            <template #header>
                                <div class="card-header"
                                    style="display:flex;align-items:center;justify-content:space-between">
                                    <span>{{item.name}}</span>
                                    <span
                                        :style="computeExpireTime(item.expire_time)<7?'color:orange;font-weight:bolder;':'color:#999;'">还剩{{computeExpireTime(item.expire_time)}}天</span>
                                </div>
                            </template>
                            <div class="text item">
                                <div>数量：{{item.number}}</div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" v-for="item,index in expiredList" :key="index">
                        <el-card class="box-card" shadow="hover" style="margin-bottom:10px;"
                            @click="openDetailDialog(item.id)">
                            <template #header>
                                <div class="card-header"
                                    style="display:flex;align-items:center;justify-content:space-between">
                                    <span>{{item.name}}</span>
                                    <span
                                        style="color:red;font-weight:bolder;">已过期{{Math.abs(computeExpireTime(item.expire_time))}}天</span>
                                </div>
                            </template>
                            <div class="text item">
                                <div>数量：{{item.number}}</div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <div v-if="!list" style="display:flex;align-items:center;justify-content:center;">
                    <el-empty description="暂无物品"></el-empty>
                </div>
            </el-tab-pane>
        </el-tabs>


        <el-dialog v-model="detailDialogVisible" :title="goodsDetail.name" width="300px">
            <div>
                <img :src="goodsDetail.img" alt="" style="width:100%;">
            </div>
            <div style="margin-top:5px;">
                <div>生产日期：{{goodsDetail.product_time}}</div>
                <div>过期日期：{{goodsDetail.expire_time}}</div>
                <div style="margin-top:5px;">备注：{{goodsDetail.remarks}}</div>
            </div>
            <template #footer>
                <span class="dialog-footer" style="display:flex;justify-content:space-between;">
                    <el-popconfirm title="确认删除该物品（价格数据不保留）？" @confirm="confirmDeleteGoods()" confirmButtonText="是" cancelButtonText="否">
                        <template #reference>
                            <el-button type="danger" @click="confirm">删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-popconfirm title="确认处理该物品（价格数据将保留）？" @confirm="thrownGoods()" confirmButtonText="是" cancelButtonText="否">
                        <template #reference>
                            <el-button type="warning" @click="confirm">处理</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button @click="openPriceDialog(goodsDetail.barcode,goodsDetail.id)">价格</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="priceDialogVisible" title="价格" width="300px">
            <div>
                <el-timeline>
                    <el-timeline-item v-for="(item, index) in priceList" :key="index" :timestamp="item.created_at">
                        {{ item.price }}元
                    </el-timeline-item>
                </el-timeline>
            </div>
            <div>平均价格：{{computeAvgPrice(priceList)}}元</div>
        </el-dialog>
        <el-dialog v-model="qrcodeDialogVisible" title="标签二维码" width="300px">
            <div>
                <vue-qr :text="targetQrcode" qid="testid" style="width:100%;"></vue-qr>
            </div>
            <div style="text-align:center;font-weight:bolder;">
                {{targetQrcodeLable}}
            </div>
        </el-dialog>
    </div>
    <MobileNavbar></MobileNavbar>
</template>

<script>
    import {
        ElMessage
    } from 'element-plus';
    import MobileNavbar from '@/components/MobileNavbar.vue';
    import teamApi from '@/service/team';
    import tagApi from '@/service/tag';
    import goodsApi from '@/service/goods';
    import {
        goodsCategoryData
    } from '@/utils/config';
    import VueQr from 'vue-qr/src/packages/vue-qr.vue'
    export default {
        components: {
            MobileNavbar,
            VueQr
        },
        computed: {
            computeExpireTime() {
                return function (v) {
                    return this.getDistanceSpecifiedTime(v)
                }
            },
            computeAvgPrice() {
                return function (v) {
                    let price = 0;
                    let avgPrice = 0;
                    if (v.length > 0) {
                        v.forEach(item => {
                            price += item.price;
                        });
                        avgPrice = price / v.length;
                    } else {
                        price = 0;
                        avgPrice = 0;
                    }
                    return avgPrice;
                }
            }
        },
        data() {
            return {
                targetQrcode: "",
                targetQrcodeLable: "",
                searchStr: "",
                tagList: [],
                baseTagList: [],
                qrcodeDialogVisible: false,
                priceDialogVisible: false,
                goodsCategory: goodsCategoryData,
                tabGoodsCategory: goodsCategoryData,
                goodsDetail: [],
                detailDialogVisible: false,
                activeName: 0,
                targetTeam: "",
                targetGroup: "",
                targetTag: "",
                targetGoods: "",
                teamList: [],
                groupList: [],
                list: [],
                expiredList: [],
                priceList: [],
            }
        },
        methods: {
            thrownGoods() {
                const formData = new FormData();
                formData.append("goods_id", this.targetGoods);
                goodsApi.thrownService(formData)
                    .then(res => {
                        this.detailDialogVisible = false;
                        this.getList();
                        this.getExpiredList();
                    })
            },
            openQrcodeDialog() {
                this.qrcodeDialogVisible = true
                this.targetQrcode = this.targetTeam + "," + this.targetGroup + "," + this.targetTag;
                this.targetQrcodeLable = this.filterLabel(this.teamList, this.targetTeam) + " - " + this.filterLabel(
                    this.groupList, this.targetGroup) + " - " + this.filterLabel(this.baseTagList, this.targetTag);

            },
            filterLabel(arr, id) {
                let label = "";
                arr.forEach(item => {
                    if (item.id == id) {
                        label = item.name;
                    }
                });
                return label;
            },
            getDistanceSpecifiedTime(dateTime) {
                // 指定日期和时间
                var EndTime = new Date(Date.parse(dateTime.replace(/-/g, "/")));
                // 当前系统时间
                var NowTime = new Date();
                var t = EndTime.getTime() - NowTime.getTime();
                var d = Math.floor(t / 1000 / 60 / 60 / 24);
                var h = Math.floor(t / 1000 / 60 / 60 % 24);
                var m = Math.floor(t / 1000 / 60 % 60);
                var s = Math.floor(t / 1000 % 60);
                return Math.abs(d);
                // return d;
                // var html = d + " 天" + h + " 时" + m + " 分" + s + " 秒";
            },
            clickTab() {
                // this.form.category = this.activeName;
                this.getList();
                this.getExpiredList();
            },
            changeTeam() {
                this.teamList.forEach(item => {
                    if (item.id == this.targetTeam) {
                        this.groupList = item.group_list;
                        if (this.$route.query.group) {
                            this.targetGroup = this.$route.query.group;
                        } else{
                        this.targetGroup = this.groupList[0].id;}
                    }
                });
                this.getList();
                this.getExpiredList();
            },
            changeGroup() {
                this.getList();
                this.getExpiredList();
            },
            changeTag() {
                this.getList();
                this.getExpiredList();
            },
            navigateManage() {
                this.$router.push("/manage/team/list")
            },
            getTeamList() {
                teamApi.getListService()
                    .then(res => {
                        this.teamList = res['data'];
                        this.groupList = this.teamList[0].group_list;
                        this.targetTeam = this.$route.query.team;
                        this.changeTeam();
                        this.getTagList();
                    })
            },
            searchGoods() {
                this.getList();
                this.getExpiredList();
            },
            getList() {
                this.list = [];
                goodsApi.getListService(this.searchStr, this.targetTeam, this.targetGroup, this.activeName, this
                        .targetTag)
                    .then(res => {
                        this.list = res['data'];
                    })
            },
            getExpiredList() {
                this.expiredList = [];
                goodsApi.getExpiredListService(this.searchStr, this.targetTeam, this.targetGroup, this.activeName, this
                        .targetTag)
                    .then(res => {
                        this.expiredList = res['data'];
                    })
            },
            onScanFailure(error) {
                console.warn(`Code scan error = ${error}`);
            },
            getGoodsDetail(id) {
                goodsApi.getDetailService(id)
                    .then(res => {
                        this.goodsDetail = res['data'];
                    })
            },
            confirmDeleteGoods() {
                const formData = new FormData();
                formData.append("goods_id", this.targetGoods);
                formData.append("team_id", this.targetTeam);
                formData.append("group_id", this.targetGroup);
                goodsApi.deleteService(formData)
                    .then(res => {
                        this.getList();
                        this.getExpiredList();
                        this.detailDialogVisible = false;
                    })
            },
            openDetailDialog(id) {
                this.targetGoods = id;
                this.detailDialogVisible = true;
                this.getGoodsDetail(id);
            },
            getPriceTimeline(barcode,goodsId) {
                this.priceList = [];
                goodsApi.getPriceTimelineService(barcode, this.targetTeam,goodsId)
                    .then(res => {
                        if (res['code'] == 200) {
                            this.priceList = res['data'];
                        } else {
                            ElMessage.error(res['error']);
                        }
                    })
            },
            openPriceDialog(barcode,goodsId) {
                this.priceDialogVisible = true;
                this.getPriceTimeline(barcode,goodsId);
            },
            getTagList() {
                tagApi.getListService(this.targetTeam, this.targetGroup)
                    .then(res => {
                        this.tagList = res['data']??[];
                        this.tagList.forEach(item => {
                            this.baseTagList.push(item)
                        });
                        if (this.$route.query.tag) {
                            this.targetTag = this.$route.query.tag;
                        } else {
                            this.targetTag = "0";
                        }
                        this.baseTagList.unshift({
                            name: "全部",
                            id: "0",
                        })
                        this.getList();
                        this.getExpiredList();
                    })
            },
            navigateToHome(){
                this.$router.push(`/overview/list`);
            }
        },
        mounted() {
            this.getTeamList();
        }
    }
</script>