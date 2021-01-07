<template>
    <div class="tab-bar-item" @click="itemClick">
<!--      我们不能把这个写死，在这里也搞一个插槽-->
      <div v-if="!isActive"><slot name="item-icon"></slot></div>
<!--      接受活跃插槽-->
      <div v-else><slot name="item-icon-active"></slot></div>
      <div :style="activeStyle"><slot name="item-text"></slot></div>
    </div>
</template>

<script>
    export default {
        name: "TabBarItem",
        props: {
            path: String,
            activeColor: {
                type: String,
                default: 'red'
            }
        },
        data () {
            return {
                //isActive: true
            }
        },
        computed: {
          isActive() {
              return this.$route.path.indexOf(this.path) == 0
          },
          activeStyle() {
              return this.isActive ? {color: this.activeColor} : {}
          }
        },
        methods: {
            itemClick() {
                this.$router.replace(this.path)//不同的item值不一样，所以这里不能写死
            }
        }
    }
</script>

<style scoped>
  .tab-bar-item{
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 15px;
  }
  .tab-bar-item img {
    width: 24px;
    height: 24px;
    margin-top: 3px;
    /*去掉图片下面多出来的3像素*/
    vertical-align: middle;
  }
</style>
