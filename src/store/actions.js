import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
   addCart(context, payload) {
     //payload 新添加的商品
     //1.方法一:
     // let oldProduct = null;
     // for(let item of state.cartList) {
     //   if(state.iid === payload.iid) {
     //     oldProduct = item;
     //   }
     // }

		return new Promise((resolve, reject) => {
			//方法二: 1.查找之前的数组是否有该商品
			let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);
			
			//2.判断oldProduct
			if(oldProduct) {
			  // oldProduct += 1
			  context.commit(ADD_COUNTER, oldProduct);
				resolve('当前的商品数量+1')
			} else {
			  payload.count = 1;
			  // context.state.cartList.push(product);
			  context.commit(ADD_TO_CART, payload);
				resolve('添加了新的商品')
			}
		})
   }
}
