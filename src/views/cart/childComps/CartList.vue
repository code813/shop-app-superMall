<template>
    <!-- 列表 -->
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item
                v-for="(item, index) in cartList"
                :key="index"
                :item-info="item"/>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll'
  import CartListItem from './CartListItem'

  import { mapGetters } from 'vuex'

  export default {
    name: 'CartList',
    components: {
      Scroll,
      CartListItem
    },
    computed: {
      //getter计算属性在computed中使用
      ...mapGetters(['cartList'])
    },
    activated() {
      this.$refs.scroll.refresh();
    }
  }
</script>

<style scoped>
  .cart-list {
    height: calc(100% - 44px - 49px - 40px);
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 89px;
  }
  .content {
    height: 100%;
    overflow: hidden;
  }
</style>
