<template>
  <div class="my">
    <div>
      <van-nav-bar title="啵啵咖啡"  />
    </div>
    <div class="my-box" :style="{backgroundImage: 'url(' + userInfo.userBg + ')'}">
      <div class="change-bg clearfix">
        <div class="fr cbg" v-if="isLogin">
          <div>更换背景</div>
          <van-uploader class="upload-box" :max-size="maxSize" :after-read="uploadFile" />
        </div>
      </div>
      <div class="user-info">
        <div v-if="isLogin">
          <div class="clearfix">
            <div class="my-img fl">
              <img class="auto-img" :src="userInfo.userImg" alt />
            </div>
            <div class="nickname fl">{{userInfo.nickName}}</div>
          </div>
          <div class="text">简介：{{userInfo.desc == '' ? ' 好久不见哦！' : userInfo.desc}}</div>
        </div>
        <div class="login-text" v-else @click="goPage('Login')">登录</div>
      </div>
    </div>

    <div>
      <van-cell-group>
        <van-cell @click="goPage(item.routeName)" :title="item.title" is-link v-for="(item, index) in litsData" :key="index" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import "../../assets/css/my.less";
export default {
  data() {
    return {
      //上传文件1MB
      maxSize: 1 * 1024 * 1024,
      litsData: [
        {
          title: "个人账号",
          routeName: 'Account'
        },
        {
          title: "我的地址",
          routeName: 'MyAddress'
        },
        {
          title: "我的收藏",
          routeName: 'Like'
        },
        {
          title: "安全中心",
          routeName: 'Secure'
        }
      ],

      //用户信息
      userInfo: {},

      isLogin: false
    };
  },

  created() {
    this.getUserInfo();
    
    if (localStorage.getItem('__Tk')) {
      this.isLogin = true;
    }
  },

  methods: {

    //跳转页面
    goPage(name) {
      if (name === 'Login') {
        this.$router.push({name});
      } else {
        if (!this.isLogin) {
          this.$toast('请先登录');
        } else {
          this.$router.push({name});
        }
      }
      
    },

    //获取用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          

          if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //获取上传文件的base64
    uploadFile(file) {
      

      //获取图片base64
      let serverBase64Img = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, '');

      //获取图片类型
      let imgType = file.file.type.split('/')[1];

      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img,
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 'I001') {
            this.userInfo.userBg = result.data.userBg;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>
