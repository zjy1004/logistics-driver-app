import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login/Login'
import ConfirmDepart from '@/views/ConfirmDepart/ConfirmDepart'
import WaybillList from '@/views/WaybillList/WaybillList'
import UserInfo from '@/views/MyCenter/UserInfo'
import Setting from '@/views/MyCenter/Setting'
import Shift from '@/views/Shift/Shift'
import EditPsd from '@/views/MyCenter/EditPsd'
import StatePage from '@/components/StatePage/StatePage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/confirm-depart',
      name: 'ConfirmDepart',
      component: ConfirmDepart
    },
    {
      path: '/deal',
      name: 'Deal',
      component: () => import('@/views/Deal/Deal')
    },
    {
      path: '/inTransit',
      name: 'InTransit',
      component: () => import('@/views/InTransit/InTransit')
    },
    {
      path: '/delievered',
      name: 'Delievered',
      component: () => import('@/views/Delievered/Delievered')
    },
    {
      path: '/firstChangePwd',
      name: 'FirstChangePwd',
      component: () => import('@/views/FirstChangePwd/FirstChangePwd')
    },
    {
      path: '/waybillList',
      name: 'WaybillList',
      component: WaybillList
    },
    {
      path: '/userInfo',
      name: 'UserInfo',
      component: UserInfo
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting
    },
    {
      path: '/shift',
      name: 'Shift',
      component: Shift
    },
    {
      path: '/editPsd',
      name: 'EditPsd',
      component: EditPsd
    },
    {
      path: '/statePage',
      name: 'StatePage',
      component: StatePage
    }
  ]
})
