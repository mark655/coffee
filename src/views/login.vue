<template>
  <div class="register">
    <van-nav-bar
      title="登录"
      left-text="注册"
      right-text="关闭"
      @click-left="goPage('Register')"
      @click-right="goPage('Home')"
    />
    <div class="logo">

       <figure aria-hidden="true">
          <div class="person-body"></div>
          <div class="neck skin"></div>
          <div class="head skin">
            <div class="eyes"></div>
            <div class="mouth"></div>
          </div>
          <div class="hair"></div>
          <div class="ears"></div>
          <div class="shirt-1"></div>
          <div class="shirt-2"></div>
  </figure>
  </div>

    <van-form @submit="login">
      <van-field
        v-model="userInfo.phone"
        type="text"
        label="手机号"
        placeholder="输入11位手机号"
        left-icon="phone-o"
        maxlength="11"
      />

      <van-field
        v-model="userInfo.password"
        :type="isEye ? 'text' : 'password'"
        label="密码"
        placeholder="字母数字_组合(6-16位)"
        left-icon="lock"
        :right-icon="isEye ? 'eye-o' : 'closed-eye'"
        @click-right-icon="viewPassword"
        maxlength="16"
      />
      <div class="register-btn">
        <van-button round block type="info" native-type="submit">立即登录</van-button>

        <div class="forgot">
          <span class="fr" @click="forgot">忘记密码？</span>
        </div>
      </div>
      
    </van-form>
  </div>
</template>

<script>

  //导入样式
  import '../assets/css/register.less'

  //导入验证表单模块
  import validForm from '../assets/js/validForm'

  export default {
    data() {
      return {

        //用户注册信息
        userInfo: {
          phone: '',
          password: ''
        },

        //false: 闭合，true：睁开
        isEye: false

      }
    },

    methods: {

      //跳转页面
      goPage(name) {
        this.$router.push({name});
      },

      //切换密码的格式
      viewPassword() {
        this.isEye = !this.isEye;
      },

      //登录
      login() {

        //进行验证表单
        if (validForm.validUserForm(this.userInfo)) {

          //复制对象
          let data = Object.assign({}, this.userInfo);

          //请求密钥
          data.appkey = this.appkey;

          //开启加载提示
          this.$toast.loading({
            message: '加载中...',
            forbidClick: true,

            //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
            duration:0
          });

          //发起登录请求
          this.axios({
            method: 'POST',
            url: '/login',

            //post传递参数需要写在data
            data
          }).then(result => {
            //关闭加载提示
            this.$toast.clear();
            
            if (result.data.code == 200) {
              //跳转到菜单
              

              //存储token，用于后面登录验证
              localStorage.setItem('__Tk', result.data.token);

              this.$router.push({name: 'Home'});
              
            } else {
              this.$toast(result.data.msg);
            }
          }).catch(err => {
            //关闭加载提示
            this.$toast.clear();
            console.log('err ==> ', err);
          })
        }

      },

      //找回密码
      forgot() {
        this.$router.push({name: 'Forgot'});
      }
    }
  }
</script>

<style lang="less" scoped>
  .forgot{
    margin-top: 20px;
  }
</style>