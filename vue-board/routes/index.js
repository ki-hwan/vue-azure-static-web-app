import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld'; //메인 컴포넌트 호출
import List from '@/components/board/List'; //게시판 리스트 컴포넌트 호출
import Write from '@/components/board/Write'; //게시판 리스트 컴포넌트 호출
import View from '@/components/board/View';
import SingUp from '@/components/SingUp';
import UserList from '@/components/UserList';

Vue.use(Router); //vue 라우터 사용

const routes = [
    {
        path: '/',
        component: HelloWorld    
    },
    {
        path: '/board/list',
        component : List
    },
    {
        path: '/board/write',
        component : Write
    },
    {
        path: '/board/singUp',
        component : SingUp
    },
    {
        path: '/board/userList',
        component : UserList
    },
    {
        path: '/board/view',
        component : View
    }
]

export default new Router({
    routes
})