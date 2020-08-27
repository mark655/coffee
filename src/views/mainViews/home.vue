<template>
  <div class="home">
    <div>
      <van-nav-bar title="啵啵咖啡" />
    </div>
    <div class="src">
      <div>
        <van-swipe :autoplay="3000" indicator-color="white" style="height:163.03px">
          <van-swipe-item v-for="(item,index) in banner" :key="index">
            <img class="auto-img" :src="item.bannerImg" alt />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="column">
        <div>
          <img class="c-img" src="@/assets/images/mw.png" />
          <span>免费品尝</span>
        </div>

        <div>
          <img class="c-img" src="@/assets/images/dg.png" />
          <span>蛋糕食品</span>
        </div>
        <div>
          <img class="c-img" src="@/assets/images/cup.png" />
          <span>心怡磨咖</span>
        </div>

        <div>
          <img class="c-img d-img" src="@/assets/images/py.png" />
          <span>咖啡圈</span>
        </div>
      </div>
      <div class="recommend">
        <div class="recommend-top">最新推荐 ></div>
        <div class="list clearfix">
          <div class="recommend-list fl" v-for="(item,index) in isHot" :key="index" @click = "goDetail(item.pid)">
            <div class="fl recommend-item">
              <img class="item-img" :src="item.smallImg" alt />
            </div>
            <div class="item-name">{{item.name}}</div>
            <div class="item-price">{{item.price}}</div>
            <div class="item-remark">{{item.desc}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="recommend">
      <div class="recommend-top">拿铁 ></div>
      <div class="list clearfix">
        <div class="recommend-list fl" v-for="(item,index) in latte" :key="index" @click = "goDetail(item.pid)">
          <div class="fl recommend-item">
            <img class="item-img" :src="item.smallImg" alt />
          </div>
          <div class="item-name">{{item.name}}</div>
          <div class="item-price">{{item.price}}</div>
          <div class="item-remark">{{item.desc}}</div>
        </div>
      </div>
    </div>
    <div class="recommend">
      <div class="recommend-top">咖啡 ></div>
      <div class="list clearfix">
        <div class="recommend-list fl" v-for="(item,index) in coffee" :key="index" @click = "goDetail(item.pid)">
          <div class="fl recommend-item">
            <img class="item-img" :src="item.smallImg" alt />
          </div>
          <div class="item-name">{{item.name}}</div>
          <div class="item-price">{{item.price}}</div>
          <div class="item-remark">{{item.desc}}</div>
        </div>
      </div>
    </div>

    <div class="recommend">
      <div class="recommend-top">瑞纳冰 ></div>
      <div class="list clearfix">
        <div class="recommend-list fl" v-for="(item,index) in rena_ice" :key="index" @click = "goDetail(item.pid)">
          <div class="fl recommend-item">
            <img class="item-img" :src="item.smallImg" alt />
          </div>
          <div class="item-name">{{item.name}}</div>
          <div class="item-price">{{item.price}}</div>
          <div class="item-remark">{{item.desc}}</div>
        </div>
      </div>
      
    </div>
      
  </div>
   
</template>

<script>
import "../../assets/css/home.less";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("menuModule");
export default {
  data() {
    return {
      banner: [],
      list: [
        {
          url:
            "http://www.kangliuyong.com:10002/images/product_small/IMG_0384_02p.jpg",
          name: "焦糖拿铁",
          price: "￥29.03",
          tit: "拿铁香气飘飘..."
        },
        {
          url:
            "http://www.kangliuyong.com:10002/images/product_small/IMG_0388_02p.jpg",
          name: "瑞纳冰",
          price: "￥28.00",
          tit: "拿铁香气飘飘..."
        },
        // {
        //   url:"http://www.kangliuyong.com:10002/images/product_small/IMG_0388_02p.jpg",
        //   name:"瑞纳冰",
        //   price:"￥28.00",
        //   tit:"拿铁香气飘飘..."
        // },
        // {
        //   url:"http://www.kangliuyong.com:10002/images/product_small/IMG_0388_02p.jpg",
        //   name:"瑞纳冰",
        //   price:"￥28.00",
        //   tit:"拿铁香气飘飘..."
        // },
        {
          url:
            "http://www.kangliuyong.com:10002/images/product_small/IMG_0392_02p.jpg",
          name: "拿铁",
          price: "￥28.00",
          tit: "拿铁香气飘飘..."
        }
      ],
      isHot: [],
      latte: [],
      coffee: [],
      rena_ice: [],
      typeData: []
    };
  },

  created() {
    this.getbannerData();
    this.getTypeData();
    this.getProductByType({ key: "isHot", value: 1 }, this.isHot);
    this.getProductByType({ key: "type", value: "latte" }, this.latte);
    this.getProductByType({ key: "type", value: "coffee" }, this.coffee);
    this.getProductByType({ key: "type", value: "rena_ice" }, this.rena_ice);
  },

  methods: {
    add() {
      this.list.unshift({ id: ++this.newId, name: this.name });
      this.name = "";
    },
    getbannerData() {
      this.axios({
        method: "GET",
        url: "http://www.kangliuyong.com:10002/banner",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA="
        }
      })
        .then(result => {
          if (result.data.code == 300) {
            this.banner = result.data.result;
          }
        })
        .catch(err => {
        });
    },
    //获取商品类型数据
    getTypeData() {
      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          if (result.data.code == 400) {
            result.data.result.unshift({
              type: "isHot",
              typeDesc: "最新推荐"
            });
            this.typeData = result.data.result;
          }
        })
        .catch(err => {
        });
    },
    //根据类型获取商品数据
    getProductByType(data, arr) {
      let params = {
        appkey: this.appkey,
        key: data.key,
        value: data.value
      };
      this.axios({
        method: "GET",
        url: "/typeProducts",
        params
      })
        .then(result => {
          if (result.data.code == 500) {
            for (let i = 0; i < result.data.result.length; i++) {
              arr.push(result.data.result[i]);
            }
          }
        })
        .catch(err => {
        });
    },

    //tiao
    goDetail(pid) {
      //pid: 商品id
      this.$router.push({name: 'Detail', query: {pid}});
    }
  }
};
</script>

<style lang="less" scoped>
</style>