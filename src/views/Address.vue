<template>
  <div class="address">
    <van-nav-bar :title="!!aid ? '我的地址' : '新增地址'" left-text="返回" left-arrow @click-left="back" />
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      show-postal
      :show-delete="!!aid"
      show-set-default
      save-button-text="保存地址"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="saveAddress"
      @delete="removeAddress"
    />
  </div>
</template>

<script>
import "../assets/css/address.less";

//导入地址数据
import areaList from "../assets/js/area";

export default {
  data() {
    return {
      areaList,

      //地址信息
      addressInfo: {
        //收货人
        name: "",
        //手机号
        tel: "",
        //省
        province: "",
        //城市
        city: "",
        //区县
        county: "",
        //详细地址
        addressDetail: "",
        //地区编号，地址选择
        areaCode: "",
        //邮编
        postalCode: "",
        //默认地址
        isDefault: false
      },
      //地址id
      aid: ""
    };
  },

  created() {
    //截取路由参数 地址id: aid
    this.aid = this.$route.params.aid;
    

    //如果是编辑地址，则查询地址数据关联
    if (this.aid) {
      this.getAddressByAid(this.aid);
    }
  },

  methods: {
    //保存地址
    saveAddress(addressData) {
      

      let isSame = true;

      if (this.aid) {
        //判断用户是否修改地址, 需要获取当前地址数据和查询地址数据是否一致
        
        for (let key in this.addressInfo) {

          //存在不同数据,表明用户已经修改过地址
          if (this.addressInfo[key] != addressData[key]) {
            isSame = false;
          }
        }
      }

      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      //编辑地址
      if (this.aid) {

        if (!isSame) {

          
          let userAddress = Object.assign({}, this.addressInfo);

          for (let key in userAddress) {
            userAddress[key] = addressData[key];
          }

          userAddress.isDefault = Number(userAddress.isDefault);
          userAddress.appkey = this.appkey;
          userAddress.tokenString = tokenString;
          userAddress.aid = this.aid;

          

          //发起编辑地址请求
          this.axios({
            method: "POST",
            url: "/editAddress",
            data: userAddress
          })
            .then(result => {
              this.$toast.clear();
              
              if (result.data.code == 30000) {
                this.$router.push({name: 'MyAddress'});
              } else {
                this.$toast(result.data.msg);
              }

            })
            .catch(err => {
              this.$toast.clear();
              
            });

        } else {
          this.$toast.clear();
        }
        

      } else {
        //新增地址

        let data = {
          name: "",
          tel: "",
          province: "",
          city: "",
          county: "",
          addressDetail: "",
          areaCode: "",
          postalCode: "",
          isDefault: ""
        };

        //拷贝对象属性
        for (let key in data) {
          data[key] = addressData[key];
        }

        data.appkey = this.appkey;
        data.tokenString = tokenString;
        data.isDefault = Number(data.isDefault);

        

        this.axios({
          method: "POST",
          url: "/addAddress",
          data
        })
          .then(result => {
            this.$toast.clear();
            
            if (result.data.code == 9000) {
              this.$router.push({name: 'MyAddress'});
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch(err => {
            this.$toast.clear();
            
          });
      }
    },

    //根据地址id获取地址数据
    getAddressByAid(aid) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 40000) {
            result.data.result[0].isDefault = Boolean(
              result.data.result[0].isDefault
            );
            for (let key in this.addressInfo) {
              this.addressInfo[key] = result.data.result[0][key];
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //删除地址
    removeAddress() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: 'POST',
        url: '/deleteAddress',
        data: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid
        }
      })
        .then(result => {
          this.$toast.clear();
          

          if (result.data.code == 10000) {
            this.$router.push({name: 'MyAddress'});
          } else {
            this.$toast(result.data.msg);
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //返回
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

