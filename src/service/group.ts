import request from '../utils/request';
const groupApi={
    getListService(teamId: any){
        return request({
            url:`v1/user/group/list?team_id=${teamId}`,
            method:"get",
        })
    },
    addService(data: any){
        return request({
            url:`v1/user/group/add`,
            method:"post",
            data:data,
        })
    },
    deleteService(data: any){
        return request({
            url:`v1/user/group/delete`,
            method:"post",
            data:data,
        })
    },
    updateService(data: any){
        return request({
            url:`v1/user/group/update`,
            method:"post",
            data:data,
        })
    }
}
export default groupApi;