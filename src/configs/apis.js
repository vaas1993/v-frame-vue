const ProdHost1 = 'https://open.hwsiot.com'
const TestHost1 = 'https://test.open.hwsiot.com'
const DevHost1 = 'http://dev.open.hwsiot.com'
// 根据运行环境，切换接口地址
let host1 = undefined
let version = process.env.NODE_ENV

if( version === 'production' ) {
    host1 = ProdHost1
} else if(version === 'development') {
    host1 = DevHost1
} else {
    host1 = TestHost1
}

export default {
    user: {
        list: {
            url: host1 + '/v35/api/user/list'
        },
    },
    store: {
        list: {
            url: host1 + '/v35/api/store/list'
        },
    },
}