<template>
  <!-- 首页的内容 -->
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control class="tab-control"
                :titles="titles"
                @itemClick="itemClick"
                ref="tabControl1"
                v-show="isTabFixed"/>
    <scroll class="content"
             ref="scroll"
             :probe-type="3"
             @scroll="contentScroll"
             :pull-up-load="true"
             @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImgLoad="swiperImgLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="titles"
                  @itemClick="itemClick"
                  ref="tabControl2"/>
      <goods-list :goods="goods[currentType].list"/>
    </scroll>
    <back-top @click.native="backTopClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  //公共组件
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'

  //子组件
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

//请求数据方法
//不是default导出的要大括号导入
  import {getHomeMultidata, getHomeGoods} from 'network/home.js'
  import {debounce} from 'common/utils'
  import {itemListenerMixin, backTopMixin} from 'common/mixin'

  export default {
    name: 'Home',
    components: {
      NavBar,
      TabControl,
      GoodsList,
      Scroll,

      HomeSwiper,
      RecommendView,
      FeatureView
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        //存储请求回来的数据，在res执行完之前把它保存起来，不被回收掉
        banners: [],
        recommends: [],
        titles: ['流行', '新款', '精选'],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
      }
    },
    //组件创建好之后发送网络请求
    created() {
      //1.请求多个数据
      this.getHomeMultidata();

      //2.请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    activated() {
      this.$refs.scroll.refresh();
      this.$refs.scroll.scrollTo(0, this.saveY, 0);
    },
    deactivated() {
      //1.保存y值
      this.saveY = this.$refs.scroll.scroll.y;

      //2.取消全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImgListener);
    },
    mounted() {

    },
    methods: {
      /*
      * 事件监听相关的方法
      */
      itemClick(index) {
        switch (index) {
          case 0:
          this.currentType = 'pop';
          break;
          case 1:
          this.currentType = 'new';
          break;
          case 2:
          this.currentType = 'sell';
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      //1.回到顶部
      backTopClick() {
        // this.$refs.scroll.scroll.scrollTo(0, 0)
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position) {


        // 2. 决定tabControl是否吸顶(isTabFixed)
         this.isTabFixed = -(position.y) > this.tabOffsetTop
      },
      // 3.监听上拉加载
      loadMore() {
        this.getHomeGoods(this.currentType);
        //调用refresh() 重新计算高度
        // this.$refs.scroll.refresh();
      },
      swiperImgLoad() {
        // 获取tabControl的offsetTop
        //所有的组件都有一个属性$el: 用于获取组件中的元素
        // console.log(this.$refs.tabControl2.$el.offsetTop);
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      /*
      *  网络请求相关的方法
      */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // console.log(res)
          // this.result = res;
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          // console.log(res);
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1

          //.完成上拉加载更多
          this.$refs.scroll.finishPullUp();
        })
      }
    }
  }
</script>

<style scoped>
 #home {
   /* padding-top: 44px; */
   height: 100vh;
   position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
   /* position: fixed;
    top: 0;
    left: 0;
    right: 0;
   z-index: 9; */
  }
 .tab-control {
   position: relative;
   z-index: 9;
  }
  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
 /* .content {
    height: calc(100% - 93px);
   overflow: hidden;
   margin-top: 44px;
  } */
</style>
