import {debounce} from './utils.js'
import BackTop from 'components/content/backTop/BackTop'
import {BACK_POSITION} from 'common/const';
import {POP, SELL, NEW} from "@/common/const";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    // 这个地方img标签确实被挂载, 但是其中的图片还没有占据高度

    // this.$refs.scroll.refresh 对这个函数进行防抖操作
    const refresh = debounce(this.$refs.scroll.refresh, 100);

    // 对监听的事件进行保存
    this.itemImgListener = () => {
      // this.$refs.scroll.refresh();
      refresh();
     }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    //1.点击回到顶部
    backTopClick() {
      // this.$refs.scroll.scroll.scrollTo(0, 0)
      this.$refs.scroll.scrollTo(0, 0)
    }
  }
}

export const tabControlMixin = {
    data() {
      return {
        currentType: POP
      }
    },
    methods: {
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = POP
            break
          case 1:
            this.currentType = NEW
            break
          case 2:
            this.currentType = SELL
            break
        }
        console.log(this.currentType);
      }
    }
  }
