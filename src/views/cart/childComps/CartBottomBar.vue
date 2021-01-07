<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll"
                     @click.native="checkClick"
                     class="check-button"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计:{{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'
  import { mapGetters } from 'vuex'

  export default {
    name: 'CartBottomBar',
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        }, 0).toFixed(2)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        //购物车为空 返回false
         if(this.cartList.length === 0) return false

        //方法一: filter过滤
        // return !(this.cartList.filter(item => !item.checked).length)

        //方法二: find查找
        //return !this.cartList.find(item => !item.checked)

        //方法三: 普通遍历
        let isChecked = false;
        for(let item of this.cartList) {
          if(!item.checked) {
            return false
          }
        }
        return true
      }
    },
    methods: {
      checkClick() {
        if(this.isSelectAll) { //全部选中
          this.cartList.forEach(item => item.checked = false)
        } else { //部分或全部不选中
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        if(!this.isSelectAll) {
          this.$toast.show('请选择购买的商品', 2000)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    display: flex;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background-color: #eee;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 49px;
  }
  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }
  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price {
    margin-left: 20px;
    flex: 1;
  }
  .calculate {
    width: 100px;
    text-align: center;
    background-color: orangered;
  }
</style>
