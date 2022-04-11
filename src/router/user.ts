import UserMain from '../views/user/main.vue';

export default[{
    path:"/user",
    component:UserMain,
    children:[
        {
            path:"goods/list",
            name:"goods",
            component:()=>import('../views/goods/list.vue'),
        }
    ]
}]