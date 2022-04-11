import request from '../utils/request';

const tagApi={
    getListService(teamId: any,groupId: any){
        return request({
            url:`v1/user/tag/list?team_id=${teamId}&group_id=${groupId}`,
            method:"get",
        })
    }
}

export default tagApi;