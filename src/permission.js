import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
//白名单
const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  //从cookies里面获取token
  const hasToken = getToken()
  //判断token是否存在
  if (hasToken) {
    //判断是否是登录
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      //是登录跳转到首页
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      //从vuex中获取权限
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      //如果存在
      if (hasRoles) {
        //放行
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          //roles必须是一个数组
          //获取用户信息和权限信息，存到vuex里面
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          //生成路由数据，是一个数组
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // console.log(accessRoutes)
          // dynamically add accessible routes
          //添加到路由
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          //清空token
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          //跳转登录
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    //判断是否存在白名单中
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      //跳转登录
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
