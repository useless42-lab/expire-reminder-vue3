import AuthMain from '../views/auth/main.vue';

export default [{
    path:"/auth",
    component:AuthMain,
    children:[
        {
            path:"login",
            name:"Login",
            component:()=>import( '../views/auth/login.vue')
        },
        {
            path:"register",
            name:"register",
            component:()=>import( '../views/auth/register.vue')
        }
    ]
}]