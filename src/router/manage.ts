import UserManage from '../views/user/manage.vue';

export default[{
    path:"/manage",
    component:UserManage,
    children:[
        {
            path:"team/list",
            component:()=>import('../views/team/list.vue'),
        },
        {
            path:"notification/list",
            component:()=>import('../views/notification/list.vue'),
        },
        {
            path:"subscribe/list",
            name:"subscribe",
            component:()=>import('../views/subscribe/list.vue'),
        }
    ]
}]