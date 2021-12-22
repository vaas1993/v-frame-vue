// import {createApp} from "vue"
import {createVNode, render} from "vue"


export default class Marker {
    /**
     * 覆盖物ID
     */
    id = (((1 + Math.random()) * 0x1000000) | 0).toString(16)

    /**
     * 覆盖物的偏移度
     * 格式为 x,y ，用逗号分隔符隔开，支持 top、left、right、bottom、middle
     * 比如 left,top 代表左上角，middle，bottom 代表底边中点，middle,middle代表图标中点
     * @type {string}
     */
    offset = 'middle,bottom'

    /**
     * 经度
     */
    longitude

    /**
     * 纬度
     */
    latitude

    /**
     * 覆盖物图片的宽度
     * @type {number}
     */
    width = 28

    /**
     * 覆盖物图片的高度
     * @type {number}
     */
    height = 40

    /**
     * 覆盖物图片
     * @type {string}
     */
    image = '//webapi.amap.com/theme/v1.3/markers/b/mark_bs.png'

    /**
     * 消息窗口的HTML
     * @type {object}
     */
    infoWindow = {
        widget: undefined,
        options: {},
        events: {}
    }

    /**
     * 覆盖物名称，会显示在地图上
     * @type {undefined|String}
     */
    name = undefined

    /**
     * 是否显示覆盖物
     * @type {boolean}
     */
    visible = true

    /**
     * 地图覆盖物的实例，可通过 this.instanceToXXX 系列方法来实例化它
     * @type {object}
     */
    instance = undefined

    /**
     * 设置覆盖物的ID，每个覆盖物的ID必须是唯一存在的，否则后面添加的会替换前面添加的
     * 该方法需要在调用地图组件的 addMarker 方法之前调用
     * 若不主动调用，这个类在实例化时就会自动生成一个唯一值
     * @param {string|number} id
     */
    setId(id) {
        if( this.instance && this.id !== id) {
            console.error('地图覆盖物已实例化，不允许修改其ID，若需要修改请先删除覆盖物再修改，或着在将覆盖物添加进地图之前调用该方法')
            return
        }
        this.id = id
    }

    /**
     * 设置覆盖物是否可见
     * 对于需要频繁显示和隐藏的可以通过这个方法来切换
     * 如果是需要删除，请使用地图的 removeMarker 方法
     * @param {boolean} show
     */
    setVisible(show) {
        this.visible = !!show
    }

    /**
     * 设置消息窗口
     * @param {VueComponent} widget VUE组件
     * @param {object} options 用于渲染组件的参数，需要先在组件内部的props定义
     * @param {object} events 组件事件
     */
    setInfoWindow({widget, options = {}, events = {}}) {
        this.infoWindow = {
            widget, options, events
        }
    }

    /**
     * 获取消息窗口的HTML文本
     * @returns {string|null}
     */
    getInfoWindowHTML() {
        if( !this.infoWindow.widget ) {
            return null
        }
        let id = '#info-window-' + this.id
        let node = document.getElementById(id)
        if( !node ) {
            node = document.createElement('div', {
                id
            })
        }

        let instance = createVNode(this.infoWindow.widget, this.infoWindow.options || {})
        instance.appContext = window.getApp()._context
        render(instance, node)
        return instance.el
    }

    /**
     * 设置覆盖物所属的经纬度
     * @param {number} longitude
     * @param {number} latitude
     */
    setPosition(longitude, latitude) {
        this.longitude = longitude
        this.latitude = latitude
    }

    /**
     * 获取覆盖物图片
     * @returns {string}
     */
    getImage() {
        return this.image
    }
}