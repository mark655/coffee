<template>
  <div class="like">
    <van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="back" />
    <div class="like-content" v-if="likeData.length > 0">
      <div class="fl content-item" :class="[index % 2 == 0 ? 'left' : 'right']" v-for="(item, index) in likeData" :key="index">
          <div @click="goDetail(item.pid)">
            <img
              class="auto-img"
              v-lazy="item.smallImg"
              alt
            />
          </div>
          <div class="pro-name one-text">{{item.name}}</div>
          <div class="pro-enname one-text">{{item.enname}}</div>
          <div class="pro-price-box">
            <div class="fl pro-price">￥{{item.price}}</div>
            <div class="fr delete" @click="removeLike(item.pid, index)">
              <van-icon name="delete" />
            </div>
          </div>
        </div>
    </div>
    <div v-else>
      <van-empty description="我的收藏空空如也，逛一逛" />
    </div>
  </div>
</template>

<script>
import '../assets/css/like.less'
export default {
  data() {
    return {
      //我的收藏商品数据
      likeData: []
    };
  },

  created() {
    //获取我的收藏商品数据
    this.getLikeData();
  },

  methods: {
    //返回
    back() {
      this.$router.go(-1);
    },

    //获取我的收藏商品数据
    getLikeData() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 2000) {
            this.likeData = result.data.result;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //根据商品id查看商品详情
    goDetail(pid) {
      this.$router.push({name: 'Detail', query: {pid}});
    },

    //删除我的收藏
    removeLike(pid, index) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/notlike",
        data: {
          appkey: this.appkey,
          tokenString,
          pid
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 900) {
            this.likeData.splice(index, 1);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>
