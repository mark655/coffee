<template>
  <div class="forgot">
    <van-nav-bar title="找回密码" left-text="返回" left-arrow @click-left="back" />
    <div class="forgot-box">
      <div v-if="!isNext">
        <van-form>
          <van-field
            v-model="first.email"
            type="text"
            label="邮箱"
            placeholder="邮箱地址"
          />
          <!-- key: 防止当前表单域会将内容携带给其他表单域 -->
          <van-field key="code" v-model="first.code" type="text" label="验证码" placeholder="6位验证码">
            <template #button>
              <van-button size="small" type="info" @click="sendCode" :disabled="isSend">{{text}}</van-button>
            </template>
          </van-field>
          <div class="register-btn">
            <van-button round block type="info" native-type="submit" @click="next">下一步</van-button>
          </div>
        </van-form>
      </div>
      <div v-else>
        <van-form @submit="commit">
          <van-field
            v-model="userInfo.phone"
            type="text"
            label="手机号"
            placeholder="注册时手机号"
            left-icon="phone-o"
            maxlength="11"
          />
          <van-field
            v-model="userInfo.password"
            :type="isEye ? 'text' : 'password'"
            label="新密码"
            placeholder="字母数字_组合(6-16位)"
            left-icon="lock"
            :right-icon="isEye ? 'eye-o' : 'closed-eye'"
            @click-right-icon="viewPassword"
            maxlength="16"
          />
          <div class="register-btn">
            <van-button round block type="info" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/css/forgot.less'
import validForm from '../assets/js/validForm'
export default {
  data() {
    return {
      isNext: false,
      first: {
        email: '',
        code: ''
      },
      userInfo: {
        phone: "",
        password: ""
      },
      //false: 闭合，true：睁开
      isEye: false,

      text: '发送验证码',
      isSend: false
    };
  },
  methods: {
    back() {
      if (this.isNext) {
        this.isNext = false;
      } else {
        this.$router.go(-1);
      }
      
    },
    //切换密码的格式
    viewPassword() {
      this.isEye = !this.isEye;
    },

    //下一步
    next() {

      if (!validForm.validUserForm(this.first)) {
        return;
      }

      //发起发送验证码请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/checkValidCode",
        data: {
          appkey: this.appkey,
          validCode: this.first.code
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 'K001') {
            this.isNext = true;
          } else {
            this.$toast(result.data.msg);
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //发送验证码
    sendCode() {
      if (!validForm.validUserForm({email: this.first.email})) {
        return;
      }

      //获取邮箱验证码
      let time = 60;
      this.text = time + '秒后重新发送';
      this.isSend = true;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          timer = null;
          this.text = '发送验证码';
          this.isSend = false;
        } else {
          time--;
          this.text = time + '秒后重新发送';
        }
      }, 1000);

      //发起发送验证码请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/emailValidCode",
        data: {
          appkey: this.appkey,
          email: this.first.email
        }
      })
        .then(result => {
          this.$toast.clear();
          

          this.$toast(result.data.msg);
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });

    },

    //提交，找回密码
    commit() {
      if (!validForm.validUserForm(this.userInfo)) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/retrievePassword",
        data: {
          appkey: this.appkey,
          phone: this.userInfo.phone,
          password: this.userInfo.password
        }
      })
        .then(result => {
          this.$toast.clear();
          
          
          if (result.data.code == 'L001') {
            this.$router.push({name: 'Login'});
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
