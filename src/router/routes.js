export const routes = [
  {
    path: '/register',
    name: 'Register',
    component: r => require(['../views/register.vue'], r)
  },
  {
    path: '/login',
    name: 'Login',
    component: r => require(['../views/login.vue'], r)
  },
  {
    path: '/main',
    name: 'Main',
    component: r => require(['../views/Main.vue'], r),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: r => require(['../views/mainViews/home.vue'], r)
      },
      {
        path: 'order',
        name: 'Order',
        component: r => require(['../views/mainViews/Order.vue'], r)
      },
      {
        path: 'shopcart',
        name: 'Shopcart',
        component: r => require(['../views/mainViews/Shopcart.vue'], r)
      },
      {
        path: 'my',
        name: 'My',
        component: r => require(['../views/mainViews/My.vue'], r)
      }
    ]
  },
  {
    path: '/detail',
    name: 'Detail',
    component: r => require(['../views/Detail.vue'], r)
  },
  {
    path: '/address/:aid?',
    name: 'Address',
    component: r => require(['../views/Address.vue'], r)
  },
  {
    path: '/myAddress',
    name: 'MyAddress',
    component: r => require(['../views/MyAddress.vue'], r)
  },
  {
    path: '/pay',
    name: 'Pay',
    component: r => require(['../views/Pay.vue'], r)
  },
  {
    path: '/like',
    name: 'Like',
    component: r => require(['../views/Like.vue'], r)
  },
  {
    path: '/account',
    name: 'Account',
    component: r => require(['../views/Account.vue'], r)
  },
  {
    path: '/secure',
    name: 'Secure',
    component: r => require(['../views/Secure.vue'], r)
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: r => require(['../views/Forgot.vue'], r)
  },
  {
    path: '*',
    redirect: {
      name: 'Register'
    }
  }
]