<template>
  <!-- 个人中心 -->
  <div id="profile">
   <!-- 头部导航 -->
    <nav-bar class="profile-nav">
      <div slot="center">超级商场</div>
    </nav-bar>

   <!-- 登录信息 -->
    <user-info/>

   <!-- 余额 优惠 积分 -->
    <account-info/>

   <!-- 我的会员卡信息 -->
   <normal-list-view :list-data="orderList"/>
   <normal-list-view :list-data="serviceList"/>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'

  import UserInfo from './childComps/UserInfo'
  import AccountInfo from './childComps/AccountInfo'
  import NormalListView from './childComps/NormalListView'

  export default {
    name: 'Profile',
    components: {
      NavBar,
      UserInfo,
      AccountInfo,
      NormalListView
    },
    data() {
      return {
        orderList: [
          {icon: 'message.svg', info: '我的消息'},
          {icon: 'pointer.svg', info: '积分商城'},
          {icon: 'vip.svg', info: '会员卡'},
        ],
        serviceList: [
          {icon: 'cart.svg', info: '我的购物车'},
          {icon: 'shopping.svg', info: '下载购物App'},
        ]
      }
    }
  }
</script>

<style scoped>
  #profile {
    background-color: #f2f2f2;
  }
  .profile-nav {
    background-color: var(--color-tint);
    color: #fff;
  }
</style>
