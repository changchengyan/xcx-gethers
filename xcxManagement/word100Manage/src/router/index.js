import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode:'history',
    routes: [
        {
            path: '/',
            redirect : {
                name: 'login'
            }
        },
        {
            path: '/manage',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path : 'lessonManage',
                    component : resolve =>require(['../components/page/lessonManage/index.vue'], resolve),
                },
                {
                    path: 'lessonBriefEdit',
                    component: resolve => require(['../components/page/lessonManage/manageNav/lessonBriefEdit.vue'], resolve)
                },
                {
                    path: 'basecharts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve) // vue-schart组件
                },
                {
                    path:"dataBaseEdit",
                    component : resolve => require(['../components/page/lessonManage/manageNav/dataBaseEdit/index.vue'], resolve),
                    children:[
                        {
                            path : 'wordsManage/:id',
                            name : 'wordsManage',
                            component : resolve => require(['../components/page/lessonManage/manageNav/dataBaseEdit/dataBaseNav/wordsManage.vue'], resolve)
                        }, {
                            path: 'caseManage/:id',
                            name:"caseManage",
                            component : resolve => require(['../components/page/lessonManage/manageNav/dataBaseEdit/dataBaseNav/caseManage.vu' +
                                    'e'], resolve)
                        },
                        {
                            path: 'statisticsManage/:id',
                            name : 'statisticsManage',
                            component : resolve => require(['../components/page/lessonManage/manageNav/dataBaseEdit/dataBaseNav/statisticsMan' +
                                    'age.vue'], resolve)
                        },
                        // {
                        //     path : 'importData',
                        //     component : resolve => require(['../components/page/lessonManage/manageNav/dataBaseEdit/dataBaseNav/statisticsMan' +
                        //             'age.vue'], resolve)
                        // }
                    ]
                }
            ]
        },
        {
            path: '/login',
            name : 'login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
