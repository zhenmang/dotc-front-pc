import buyCoin from './buyCoin.js'
import home from './home.js'
import invest from './invest.js'
import myAssets from './myAssets.js'
import orderRecord from './orderRecord.js'
import sellCoin from './sellCoin.js'
import problem from './problem.js'
import appeal from './appeal.js'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/buy-sell', redirect: '/buy-sell/buy-coin/select-seller/seller-list' },
  ...buyCoin,
  ...home,
  ...invest,
  ...myAssets,
  ...orderRecord,
  ...sellCoin,
  ...problem,
  ...appeal
]

export default routes
