<template>
    <el-dialog v-model="searchDialogVisible" title="搜索" fullscreen>
        <div style="display:flex;align-items:center;width:100%;">
            <input style="padding:8px 12px;color:#000;border-radius:100px;border:1px solid #999;width:inherit;"
                type="text" v-model="searchStr" autofocus>
            <span class="mdi mdi-magnify" style="font-size:2em;margin-left:5px;" @click="onSearch"></span>
        </div>
        <div>
            <div v-for="(item, index) in searchList" :key="index" style="margin:10px 0;"
                @click="navigateToGoodsList(item.id)">
                <div style="font-size:1.2em;margin-bottom:5px;">{{item.name}}</div>
                <div>查询到{{item.search}}条记录</div>
            </div>
        </div>
    </el-dialog>
    <div class="container">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:20px;">
            <div @click="searchDialogVisible=true;"
                style="display:flex;align-items:center;padding:5px 10px;background-color:#eee;color:#ccc;border-radius:100px;width:100%;">
                <span class="mdi mdi-magnify" style="font-size:1.3em;"></span>
                <span style="margin-left:5px;">搜索</span>
            </div>
            <span class="mdi mdi-qrcode-scan hidden-sm-and-up" style="margin-left:15px;font-size:1.3em;"
                @click="openScanQrcode()"></span>
            <span v-if="$route.path=='/overview/list'" class="mdi mdi-calendar-outline hidden-xs-only" style="font-size:1.5em;margin-left:15px;" @click="navigateToCalendar()"></span>
            <span v-if="$route.path=='/overview/calendar'" class="mdi mdi-home hidden-xs-only" style="font-size:1.5em;margin-left:15px;" @click="navigateToIndex()"></span>
            <span class="mdi mdi-cog-outline hidden-xs-only" style="font-size:1.5em;margin-left:15px;" @click="navigateToSetting()"></span>
        </div>
    </div>
    <el-dialog v-model="scanQrcodeDialogVisible" title="扫描标签二维码" width="300px">
        <div id="qrcodereader" width="600px" class="hidden-md-and-up" style="margin-bottom:15px;"></div>
    </el-dialog>
</template>

<script>
    import {
        Html5QrcodeScanner
    } from "html5-qrcode";
    import teamApi from '@/service/team';
export default {
    data() {
        return {
                searchStr: "",
                searchList: [],
                searchDialogVisible: false,
                scanQrcodeDialogVisible: false,
        }
    },
    methods:{
            onSearch() {
                const formData = new FormData();
                formData.append("search_str", this.searchStr);
                teamApi.SearchOverviewService(formData)
                    .then(res => {
                        this.searchList = res['data'];
                    })
            },
            onScanQrcodeSuccess(decodedText, decodedResult) {
                console.log(`Code matched = ${decodedText}`, decodedResult);
                let decodeArr = decodedText.split(",");
                let targetTeamId = decodeArr[0].toString();
                let targetGroupId = decodeArr[1].toString();
                let targetTagId = decodeArr[2].toString();
                this.$router.push(
                    `/user/goods/list?team=${targetTeamId}&group=${targetGroupId}&tag=${targetTagId}`);
            },
            onScanQrcodeFailure(error) {
                console.warn(`Code scan error = ${error}`);
            },
            openScanQrcode() {
                this.scanQrcodeDialogVisible = true;
                let canUseBarCode = true;
                if (!('BarcodeDetector' in window)) {
                    console.log('此浏览器不支持条形码检测器。');
                    canUseBarCode = false;
                } else {
                    console.log('支持条形码检测器！');
                    canUseBarCode = true;
                }
                var that = this;
                setTimeout(function () {
                    console.log("canUseBarCode", canUseBarCode)
                    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
                        let html5QrcodeScanner = new Html5QrcodeScanner(
                            "qrcodereader", {
                                fps: 10,
                                qrbox: {
                                    width: 250,
                                    height: 250
                                },
                                experimentalFeatures: {
                                    useBarCodeDetectorIfSupported: canUseBarCode
                                }
                            },
                            false);
                        html5QrcodeScanner.render(that.onScanQrcodeSuccess, that.onScanQrcodeFailure);
                    } else {
                        console.log("12313123")
                    }
                }, 500);
            },
            navigateToGoodsList(id) {
                this.$router.push(`/user/goods/list?team=${id}`)
            },
            navigateToCalendar(id) {
                this.$router.push(`/overview/calendar`)
            },
            navigateToIndex(){
                this.$router.push(`/overview/list`)
            },
            navigateToSetting(){
                this.$router.push(`/manage/team/list`)
            }
    },
}
</script>