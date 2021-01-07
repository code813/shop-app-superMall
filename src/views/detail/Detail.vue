<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>

    <back-top @click.native="backTopClick" v-show="isShowBackTop"/>
    <!-- <toast :message="message" :show="show"/> -->
  </div>
</template>

<script>
  //子组件
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  //公共组件
  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  // import Toast from 'components/common/toast/Toast'

  //数据请求
  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
  import {itemListenerMixin, backTopMixin} from 'common/mixin'
  import {debounce} from 'common/utils'

  import { mapActions } from 'vuex'
  export default {
    name: 'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      GoodsList,
      Scroll,
      //Toast
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemTopY: null,
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    created() {
      //1.保存传入的iid
      this.iid = this.$route.params.iid;

      //2. 根据iid请求详细的数据
      getDetail(this.iid).then(res => {
        //1.读取数据
        const data = res.result;
        // console.log(data);
        // 2. 获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages;

        // 3.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

        //4. 创建店铺信息对象
        this.shop = new Shop(data.shopInfo);

        //5.保存商品的详细数据
        this.detailInfo = data.detailInfo;

        //6.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);

        //7.取出评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

      })

      //3.请求推荐数据
      getRecommend().then(res => {
        console.log(res);
        this.recommends = res.data.list
      })

      //4.给getThemTopY赋值(对给getThemTopY进行赋值的操作进行防抖)
      this.getThemTopY = debounce(() =>{
           this.themeTopYs = [];
           this.themeTopYs.push(0);
           this.themeTopYs.push(this.$refs.params.$el.offsetTop)//参数的offsetTop
           this.themeTopYs.push(this.$refs.comment.$el.offsetTop)//评论的offsetTop
           this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)//推荐的offsetTop
           this.themeTopYs.push(Number.MAX_VALUE)  //获取js最大值
          console.log(this.themeTopYs);
     },100)
    },
    mounted() {

    },
    destroyed() {
      this.$bus.$off('itemImgLoad', this.itemImgListener);
    },
    methods: {
      //将actions映射到methods中
      ...mapActions(['addCart']),

      //监听详情图片加载完成
      imageLoad() {
        this.$refs.scroll.refresh();
        this.getThemTopY()
      },
      titleClick(index) {
        // console.log(index)
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        //1. 获取y值
        const positionY = -position.y;

       //2.positionY和主题中值进行对比
        let length = this.themeTopYs.length;

        // 3.判断backTop是否显示
        // console.log(position);
        this.isShowBackTop = -position.y > 1000;

       //for (let i =0; i < length; i++) {
           //方法一： 普通做法
          // if (this.currentIndex !==i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          //   this.currentIndex = i
          //   this.$refs.nav.currentIndex = this.currentIndex;
          // }
        //}

        for (let i = 0; i < length-1; i++) {
          //方法二 ：hack方法
          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex;
          }
        }
      },
      addToCart() {
        //1. 获取购物车需要展示的信息
         const product = {};
         product.image = this.topImages[0];
         product.title = this.goods.title;
         product.desc = this.goods.desc;
         product.price = this.goods.realPrice;
         product.iid = this.iid;

        //2.将商品添加到购物车(1.promise 2.mapActions)
        // this.$store.state.cartList.push(product)
        // this.$store.commit('addCart', product)
        //方法一:
        // this.$store.dispatch('addCart', product).then(res => {
        //   console.log(res);
         //})

        //方法二:
          this.addCart(product).then(res => {
            // this.show = true;
            // this.message = res

            // setTimeout(() => {
            //   this.show = false;
            //   this.message = ''
            // }, 1500)
            this.$toast.show(res, 2000)
        })
      }
    }
  }
</script>

<style scoped>
 #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
/* .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
   height: calc(100% - 93px);
   overflow: hidden;
  } */
 .content {
      position: absolute;
      top: 44px;
      bottom: 49px;
      left: 0;
      right: 0;
      overflow: hidden;
    }
</style>
