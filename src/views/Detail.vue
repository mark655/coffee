<template>
  <div class="detail">
    <van-nav-bar title="商品详情" left-text="返回" left-arrow :fixed="true" @click-left="back" />
    <div>
      <img
        class="auto-img"
        :src="productData.large_img"
        alt
      />
    </div>

    <div class="detail-content">
      <div class="clearfix detail-info">
        <span class="fl p-name">{{productData.name}}</span>
        <span class="fr like" @click="likeAndNotLike">
          <img class="auto-img" :src="require('../assets/images/' + (isLike ? 'like_active.png' : 'like.png'))" alt />
        </span>
      </div>

      <!-- 商品规格 -->
      <div class="rule-box">
        <div class="rule-item clearfix" v-for="(item, index) in productData.rules" :key="index">
          <div class="fl rule-title">{{item.title}}</div>
          <div class="rule-tags clearfix fl">
            <div class="fl tag-item" :class="{active: v.isActive}" v-for="(v, i) in item.tag" :key="i" @click="toggleRuleTag(item, v)">{{v.name}}</div>
          </div>
        </div>

      </div>

      <!-- 商品描述 -->
      <div class="desc-box">
        <div class="desc-title">商品描述</div>
        <div class="desc-content">
          <div class="desc-item" v-for="(item, index) in productData.desc" :key="index">{{item}}</div>
        </div>
      </div>

      <div class="clearfix price-box">
        <div class="fl price">￥{{productData.price}}</div>
        <div class="fr">
          <van-stepper
            v-model="count"
            :integer="true"
            theme="round"
            button-size="22"
            disable-input
          />
        </div>
      </div>

      <van-goods-action>
        <van-goods-action-icon @click="goShopcart" icon="cart-o" text="购物车" :badge="shopcartRows == 0 ? '' : shopcartRows" />
        <van-goods-action-button color="#439BF5" type="warning" text="加入购物车" @click="addShopcart" />
        <van-goods-action-button @click="addShopcart(true)" color="#1989FA" type="danger" text="立即购买" />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import "../assets/css/detail.less";
export default {
  data() {
    return {

      //商品数量
      count: 1,

      //商品id
      pid: '',

      //商品详情数据
      productData: {},

      isLike: false,

      //购物车条数，并非每个商品数量
      shopcartRows: 0
    };
  },

  created() {
    //截取查询参数
    this.pid = this.$route.query.pid;

    this.getProductDetail(this.pid);

    this.findLike(this.pid);

    this.findShopcart();
  },

  methods: {
    //根据商品id获取商品详情数据
    getProductDetail(pid) {
      
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,

        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: 'GET',
        url: '/productDetail',
        params: {
          pid,
          appkey: this.appkey
        }
      }).then(result => {
        this.$toast.clear();
        
        if (result.data.code == 600) {
          let data = result.data.result[0];
          data.desc = data.desc.split(/\n/);

          //商品规格
          let productRule = ['tem', 'sugar', 'milk', 'cream'];

          // [{title: '温度', tag: [{name: '冷'}, {name: '热'}]}, {title: '糖', tag: [{name: '全糖'}, {name: '半糖'}]}]
          let rules = [];
          productRule.forEach(v => {

            if (data[v] != '') {
              let rule = {
                title: data[v + '_desc'],
                tag: []
              };
              let tag = data[v].split(/\//);

              tag.forEach((item, i) => {
                let t = {
                  name: item,
                  isActive: i == 0
                };
                rule.tag.push(t);
              })
              rules.push(rule);
            }
          
          })

          

          data.rules = rules;

          this.productData = data;
          
        }
      }).catch(err => {
        this.$toast.clear();
        
      })
    },

    //切换规格标签
    toggleRuleTag(item, v) {
      // 
      // 

      if (v.isActive) {
        return;
      }

      //查找已经激活的规格标签
      for (let i = 0; i < item.tag.length; i++) {
        if (item.tag[i].isActive) {
          item.tag[i].isActive = false;
          break;
        }
      }

      v.isActive = true;

    },

    //收藏-取消收藏商品
    likeAndNotLike() {

      //获取token
      let tokenString = localStorage.getItem('__Tk');

      //请求路径, 收藏like, 取消收藏 notlike
      let url = this.isLike ? '/notlike' : '/like';

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,

        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: 'POST',
        url,
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString
        }
      }).then(result => {
        this.$toast.clear();
        
        if (result.data.code == 800 || result.data.code == 900) {
          //收藏成功
          this.isLike = result.data.code == 800;
          this.$toast(result.data.msg);
        } else {
          //如果token无效，则跳转到登录页面
          this.$router.push({name: 'Login'});
        }
      }).catch(err => {
        this.$toast.clear();
        
      })
    },

    //查询当前商品是否被收藏
    findLike(pid) {
      //获取token
      let tokenString = localStorage.getItem('__Tk');

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,

        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: 'GET',
        url: '/findlike',
        params: {
          appkey: this.appkey,
          pid,
          tokenString
        }
      }).then(result => {
        this.$toast.clear();
        

        if (result.data.code == 1000) {

          this.isLike = result.data.result.length > 0;

        } else {
          //如果token无效，则跳转到登录页面
          this.$router.push({name: 'Login'});
        }
        
      }).catch(err => {
        this.$toast.clear();
        
      })
    },

    //返回
    back() {
      this.$router.go(-1);
    },

    //查询购物车商品条数
    findShopcart() {
      //获取token
      let tokenString = localStorage.getItem('__Tk');
      
      this.$toast.loading({
        message: '加载中',
        forbidClick: true,
        duration: 0
      })

      //购物车条数
      this.axios({
        method: 'GET',
        url: '/findAllShopcart',
        params: {
          appkey: this.appkey,
          tokenString
        }
      }).then(result => {
        this.$toast.clear();
        

        if (result.data.code == 5000) {
          this.shopcartRows = result.data.result.length;
        }
      }).catch(err => {
        this.$toast.clear();
        
      })

    },

    //加入购物车
    addShopcart(isBuy) {

      //获取token
      let tokenString = localStorage.getItem('__Tk');

      //获取商品规格
      let rules = this.productData.rules;
      
      let rule = [];
      rules.forEach(v => {
        for (let i = 0; i < v.tag.length; i++) {
          if (v.tag[i].isActive) {
            rule.push(v.tag[i].name);
            break;
          }
        }
      })

      

      this.$toast.loading({
        message: '加载中',
        forbidClick: true,
        duration: 0
      })
      this.axios({
        method: 'POST',
        url: '/addShopcart',
        data: {
          appkey: this.appkey,
          tokenString,

          //商品id
          pid: this.pid,
          //商品数量
          count: this.count,
          //商品规格
          rule: rule.join('/')
        }
      }).then(result => {
        this.$toast.clear();
        
        if (result.data.code == 3000) {

          if (result.data.status == 1) {
            this.shopcartRows++;
          }
          
          this.$toast(result.data.msg);

          //如果是立即购买, 先将商品加入到购物车，在跳转到结算页面(提交订单页面)
          if (isBuy === true) {
            setTimeout(() => {
              this.$router.push({name: 'Pay', query: {sids: result.data.sid}});
            }, 400)
          }
          
        }
      }).catch(err => {
        this.$toast.clear();
        
      })
    },

    //跳转到购物车
    goShopcart() {
      this.$router.push({name: 'Shopcart'});
    }
  }
};
</script>

<style lang="less" scoped>
</style>