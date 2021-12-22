# V Frame的VUE实践
> 使用Element Plus UI

## 安装
```
npm install
```

## 开发时的编译和热加载
```
npm run serve
```

## 生产的编译构建
```
npm run build
```

## 测试的编译构建
```
npm run build-test
```

## 获取VF的实例
```javascript
// 可以用通用的方法
let username = VFrame.getInstance().user.getValue('username')

// 在VUE组件中提供了更简洁的方式
let username = this.$vf.user.getValue('username')
```

## 更多文档
https://github.com/vaas1993/v_frame/tree/master/documents