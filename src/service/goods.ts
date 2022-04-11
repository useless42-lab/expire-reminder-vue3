import request from '../utils/request';

const goodsApi={
    addService(data: any){
        return request({
            url:`v1/user/goods/add`,
            method:"post",
            data:data,
        })
    },
    getListService(searchStr: any,teamId: any,groupId: any,category: any,tagId: any){
        return request({
            url:`v1/user/goods/list?team_id=${teamId}&group_id=${groupId}&category=${category}&tag_id=${tagId}&search_str=${searchStr}`,
            method:"get",
        })
    },
    getExpiredListService(searchStr: any,teamId: any,groupId: any,category: any,tagId: any){
        return request({
            url:`v1/user/goods/list/expired?team_id=${teamId}&group_id=${groupId}&category=${category}&tag_id=${tagId}&search_str=${searchStr}`,
            method:"get",
        })
    },
    getGoodsNameService(barcode: any){
        return request({
            url:`v1/user/goods/name?barcode=${barcode}`,
            method:"get",
        })
    },
    getDetailService(id: any){
        return request({
            url:`v1/user/goods/detail?goods_id=${id}`,
            method:"get",
        })
    },
    deleteService(data: any){
        return request({
            url:`v1/user/goods/delete`,
            method:"post",
            data:data,
        })
    },
    getPriceTimelineService(barcode: any,teamId: any,goodsId: any){
        return request({
            url:`v1/user/goods/price/timeline?barcode=${barcode}&team_id=${teamId}&id=${goodsId}`,
            method:"get"
        })
    },
    thrownService(data: any){
        return request({
            url:`v1/user/goods/thrown`,
            method:"post",
            data:data
        })
    },
    getOverviewCalendarService(year: any,month: any){
        return request({
            url:`v1/user/overview/calendar?year=${year}&month=${month}`,
            method:"get",
        })
    }
}
export default goodsApi;