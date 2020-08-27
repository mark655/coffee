<template>
  <div class="main">
    
    <div>
      
      <!-- 二级路由插座 -->
      <router-view></router-view>

    </div>
    
    <van-tabbar v-model="tabBarName"  @change="toggleTabBar">
      <van-tabbar-item v-for="(item, index) in tabBarData" :key="index" :icon="item.icon">{{item.title}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tabBarName: 0,
        
        //底部导航数据
        tabBarData: [
          {
            icon: 'coupon-o',
            title: '主页',
            routeName: 'Home',
            url: '/main/home'
          },
          {
            icon: 'orders-o',
            title: '订单',
            routeName: 'Order',
            url: '/main/order'
          },
          {
            icon: 'shopping-cart-o',
            title: '购物车',
            routeName: 'Shopcart',
            url: '/main/shopcart'
          },
          {
            icon: 'contact',
            title: '我的',
            routeName: 'My',
            url: '/main/my'
          }
        ]
      };
    },

    created() {
      //获取路径的hash
      let hash = location.hash.slice(1);
      

      //根据路径激活相应路由
      for (let i = 0; i < this.tabBarData.length; i++) {
        if (this.tabBarData[i].url == hash) {
          this.tabBarName = i;
          break;
        }
      }
    },

    methods: {

      //切换底部导航
      toggleTabBar(index) {
        
        this.$router.push({name: this.tabBarData[index].routeName});
      }
    }
  }
</script>

<style lang="less" scoped>
    .van-tabbar{
        background: linear-gradient(to right, #fbc2eb, #a6c1ee, #fbc2eb);
    }
</style>