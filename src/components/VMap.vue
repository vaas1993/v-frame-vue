<template>
    <div class="full relative">
        <a-map
            ref="AMap"
            v-if="type === 'AMap'"
            v-bind="options || {}"
            :render="render"
            @mounted="onMapMounted"
            @marker-click="onMarkerClick"
            @info-window-close="onInfoWindowClose"
            @rectangle-change="onRectangleChange"
        ></a-map>

        <div class="track-control-container bgg-white pv-1 ph-2 br-1 bs-1" v-if="isTrackControlShow && track.points.length">
            <div class="button-list">
                <div class="text-base">操作</div>
                <el-button plain round :disabled="track.status" type="primary" @click="startTrack">
                    播放
                </el-button>
                <el-button plain round :disabled="!track.status" type="warning" @click="pauseTrack">
                    暂停
                </el-button>
                <el-button plain round :disabled="!track.status" type="warning" @click="stopTrack">
                    停止
                </el-button>
            </div>
            <div class="speed-container">
                <div class="text-base" style='margin-bottom: 2px;'>播放倍速（{{parseInt(track.speed / 100) + '倍'}}）</div>
                <el-slider
                    v-model="track.speed"
                    :min="100"
                    :max="500000"
                    :show-tooltip="false"
                ></el-slider>
            </div>

            <div class="progress-bar">
                <div class="text-base" style='margin-bottom: 2px;'>进度（{{moment(track.timestamp).format('YYYY-MM-DD HH:mm:ss')}}）</div>
                <el-slider
                    :disabled="track.status"
                    v-model="track.timestamp"
                    :min="track.firstTimestamp"
                    :max="track.lastTimestamp"
                    :show-tooltip="false"
                    :title="track.status ? '请先暂停或停止播放再调整进度' : ''"
                    @change="onTrackTimestampChange"
                ></el-slider>
            </div>
        </div>
    </div>
</template>

<script>
import AMap from "./maps/AMap"
import Marker from "./maps/Marker"
import moment from "moment"
import locale from 'moment/locale/zh-cn'
moment.locale('zh-cn', locale)
export default {
    name: "VMap",
    components: {AMap},
    data() {
        return {
            // 覆盖物列表
            markerList: {},

            // 激活状态的覆盖物ID
            openingMarker: undefined,

            track: {
                points: [],
                current: 0,
                speed: 1000,
                status: false,
                timestamp: 0,
                interval: undefined,
                firstTimestamp: 0,
                lastTimestamp: 0
            }
        }
    },
    props: {
        /**
         * 地图参数
         */
        options: {
            type: Object,
        },
        /**
         * 地图类型，目前仅实现高德地图
         * 高德地图：AMap，GCJ02
         * 百度地图：BMap，BD90
         * 高德地图：GMap，WGS84
         */
        type: {
            type: String,
            default: 'AMap'
        },
        /**
         * 地图渲染函数
         * 不同的地图有不同的渲染方式，该方法会在地图组件内容进行渲染时调用
         * 方法接收一个由地图组件传入的object类型的参数，开发者需要在方法内部根据需求对这个参数进行加工并返回
         */
        render: {
            type: Function,
        },
        /**
         * 轨迹配置
         */
        trackConfig: {
            type: Object,
        },
        /**
         * 是否展示轨迹播放的控制面板
         */
        isTrackControlShow: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        // 地图组件实例
        map() {
            return this.$refs[this.type]
        }
    },
    methods: {
        /**
         * 地图组件加载完成的事件
         * 只有在这个事件被触发了才可以使用地图实例调用地图方法，比如添加覆盖物等
         */
        onMapMounted() {
            // 将该事件穿透到父组件上
            this.$emit('mounted', this)
        },

        /**
         * 时间函数，用于返回一个经过 moment 库处理过的实例
         * @return {moment.Moment}
         */
        moment(date) {
            return moment(date)
        },

        /**
         * 方法巴士，可借助这个方法来调用实际使用地图组件的方法
         * @param {string} method 方法名
         * @returns {function}
         */
        bus(method) {
            return this.map[method]
        },

        /**
         * 将地图的中心点设置为传入的经纬度
         * 第二个参数是用来设置地图的缩放等级的，不传则视为不修改缩放等级
         * @param {{longitude: number, latitude: number}} position
         * @param {int|null} zoom
         */
        setCenter(position, zoom = null) {
            this.bus('setCenter')(position, zoom)
        },

        /**
         * 设置地图的缩放等级
         * @param {int} zoom
         */
        setZoom(zoom) {
            this.bus('setZoom')(zoom)
        },

        /**
         * 获取地图当前的缩放等级
         * @return {int}
         */
        getZoom() {
            return this.bus('getZoom')()
        },

        /**
         * 将地图的缩放等级根据覆盖物的分布设置为最佳值，让所有覆盖物都存在于相同的视野中
         */
        setOptimalZoom() {
            return this.bus('setOptimalZoom')()
        },

        /**
         * 添加一个覆盖物到地图中
         * 添加之前如果存在相同ID的覆盖物会先删除覆盖物，如果需要更新覆盖物信息请使用 updateMarker 方法，可以有效提高性能
         * @param {Marker} marker
         */
        addMarker(marker) {
            this.removeMarker(marker.id)
            this.markerList[marker.id] = marker
            this.bus('addMarker')(marker)
        },

        /**
         * 根据覆盖物ID更新覆盖物
         * 一般是手动调用 getMarker 方法获取或者自行存储的 marker 实例，将实例修改后再调用该方法以更新覆盖物在地图上的变现
         * @param {string|int} id
         */
        updateMarker(id) {
            let marker = this.getMarker(id)
            if( marker ) {
                this.bus('updateMarker')(marker)
            }
        },

        /**
         * 根据覆盖物ID获取覆盖物
         * 当覆盖物不存在时返回 null
         * @param {string|int} id
         * @returns {Marker|null}
         */
        getMarker(id) {
            return this.markerList[id] || null
        },

        /**
         * 根据覆盖物ID删除覆盖物
         * @param {string} id
         */
        removeMarker(id) {
            let marker = this.getMarker(id)
            if( marker ) {
                this.bus('removeMarker')(marker)
                delete this.markerList[id]
            }
        },

        /**
         * 清空所有覆盖物
         * 遍历覆盖物列表 markerList 字段，依次调用 removeMarker 方法
         */
        clearMarkers() {
            for (let id in this.markerList) {
                this.removeMarker(id)
            }
        },

        /**
         * 根据覆盖物ID，打开其气泡框
         * 该方法将 this.openingMarker 的值修改成对应覆盖物的ID
         * @param {string|int} id
         */
        openInfoWindow(id) {
            let marker = this.getMarker(id)
            if( marker ) {
                this.openingMarker = id
                this.bus('openInfoWindow')(marker)
            }
        },

        /**
         * 关闭气泡框
         * 打开气泡框时会将对应的覆盖物ID保存在 this.openMarker 中，这里就根据这个变量是否有值来决定是否要关闭气泡框
         */
        closeInfoWindow() {
            if( this.openingMarker !== undefined ) {
                this.openingMarker = undefined
                this.bus('closeInfoWindow')()
            }
        },

        /**
         * 气泡框关闭事件
         * 一般是由子地图组件触发，触发后会将 this.openingMarker 的值设置为 undefined
         */
        onInfoWindowClose() {
            this.openingMarker = undefined
        },

        /**
         * 覆盖物点击事件
         * 一般是由子地图组件触发，参数是对应覆盖物的实例
         * 该方法会将事件穿透，事件名为 marker-click ，如果覆盖物存在气泡框，此时也会自动打开
         * @param {Marker} marker
         */
        onMarkerClick(marker) {
            if( this.openingMarker !== marker.id ) {
                if( marker.getInfoWindowHTML() ) {
                    this.openInfoWindow(marker.id)
                }
            }
            this.$emit('marker-click', marker)
        },

        /**
         * 传入一个矩形围栏的两个点坐标，开启矩形围栏编辑模式
         * 需要两个参数都是数组格式，格式：[longitude, latitude]
         * @param {array<number>} p1 右上角的经纬度
         * @param {array<number>} p2 左下角的经纬度
         */
        openRectangle(p1, p2) {
            this.bus('openRectangle')(p1, p2)
        },

        /**
         * 关闭矩形围栏编辑模式
         */
        closeRectangle() {
            this.bus('closeRectangle')()
        },

        /**
         * 从零开始，开启矩形围栏绘制模式
         * 开启前会关闭矩形编辑模式
         * 开启后，鼠标点击地图拖动，直到松开鼠标完成一次绘制
         * 绘制完成后，返回绘制结果并自动进入编辑模式
         * @param {boolean} isMessageShow 是否要在一些步骤弹出自带的提示内容，如果要自己实现消息提醒可以将这个参数设置为 false
         * @return {array<array<number>>|null} 返回绘制结果，无效绘制时返回 null
         */
        async openNewRectangle(isMessageShow = true) {
            if( isMessageShow ) {
                this.$vf.showToast({
                    message: '在地图中点击鼠标不送开同时拖拽完成绘制',
                    type: 'info',
                    duration: 5000
                })
            }
            // 开启前，先关闭已有的矩形编辑模式
            this.closeRectangle()
            // 启动矩形绘制，该方法由子地图组件完成，并需要按照规定将绘制结果以 Promise 形式返回
            // 如果绘制成功（或者说绘制有效），则返回一个二维数组，第一个元素是右上角的经纬度，第二个元素是左下角的经纬度，否则返回 null
            let brands = await this.bus('openNewRectangle')()
            // 绘制完成后，再次关闭矩形编辑模式
            this.closeRectangle()
            // 如果返回的值不是null，则说明绘制成功
            if( brands ) {
                if( isMessageShow ) {
                    this.$vf.showToast({
                        message: '绘制成功，您可以通过矩形框的左下角和右上角进行范围调整',
                        type: 'success',
                        duration: 5000
                    })
                }
                // 绘制成功后，立刻进入矩形围栏编辑模式
                this.openRectangle(brands[0], brands[1])
            }
            // 返回绘制结果
            return brands
        },

        /**
         * 矩形围栏编辑后的事件
         * @param {array<number>} p1
         * @param {array<number>} p2
         */
        onRectangleChange(p1, p2) {
            this.$emit('rectangle-change', p1, p2)
        },

        /**
         * 添加折线
         * 第二个参数的格式：[[longitude,latitude],[longitude,latitude]]
         * @param {string|number} id 折线的ID，可通过这个ID来删除折线
         * @param {array<array<number>>} points 折线点的经纬度列表
         */
        addLine(id, points) {
            this.bus('addLine')(id, points)
        },

        /**
         * 根据ID删除折线，ID值是调用 addLine 方法时的ID值
         * @param {string|number} id
         */
        removeLine(id) {
            this.bus('removeLine')(id)
        },

        /**
         * 开启轨迹模式
         * 该方法接收一个轨迹点列表，每个轨迹点都至少需要包含 经度、纬度、时间 三个元素，并且需要调用者自行根据时间排序后传入
         * 该方法会绘制 起点、终点、当前播放点、轨迹线 四个覆盖物
         * 调用该方法后才可以调用 startTrack、pauseTrack、stopTrack、setTrackTime 等的控制方法
         * @param {array<object<longitude, latitude, time>>} points 轨迹点列表
         */
        openTrack(points) {
            if( points.length < 2 ) {
                this.$vf.showToast({
                    message: '轨迹回放至少需要2个以上的轨迹点',
                    type: 'error',
                    duration: 3000
                })
            }

            this.closeTrack()

            // 绘制轨迹线
            let id = "V-MAP-TRACK"
            this.removeLine(id)
            this.addLine(id, points.map(p => [p.longitude, p.latitude]))

            // 添加起点
            let start = new Marker()
            start.id = 'V-MAP-TRACK-START-POINT'
            start.setPosition(points[0].longitude, points[0].latitude)
            start.image = this.track.options.start.image
            start.name = this.track.options.start.name
            start.width = this.track.options.start.width || start.width
            start.height = this.track.options.start.height || start.height
            this.addMarker(start)

            // 添加终点
            let end = new Marker()
            end.id = 'V-MAP-TRACK-END-POINT'
            end.setPosition(points[points.length - 1].longitude, points[points.length - 1].latitude)
            end.image = this.track.options.end.image
            end.name = this.track.options.end.name
            end.width = this.track.options.end.width || end.width
            end.height = this.track.options.end.height || end.height
            this.addMarker(end)

            // 添加当前点
            let currentPoint = points[this.track.current]
            let current = new Marker()
            current.id = 'V-MAP-TRACK-CURRENT-POINT'
            current.image = this.track.options.current.image
            current.setPosition(currentPoint.longitude, currentPoint.latitude)
            current.width = this.track.options.current.width || current.width
            current.height = this.track.options.current.height || current.height
            current.offset = 'middle,middle'

            this.track.points = points
            this.track.timestamp = (new Date(currentPoint.time)).getTime()
            this.track.firstTimestamp = (new Date(points[0].time)).getTime()
            this.track.lastTimestamp = (new Date(points[points.length - 1].time)).getTime()

            this.addMarker(current)
            this.renderCurrentTrack(true, false)
        },

        /**
         * 开始播放轨迹
         * 调用该方法之前必须先调用 openTrack 方法
         * 开启后会自动启用一个周期为100毫秒的 setInterval，直到轨迹被暂停、停止或播放结束
         */
        startTrack() {
            // 由于播放轨迹对性能有一定的影响，为避免意外的多次调用该方法，当播放状态为 true 时自动略过播放逻辑
            if( this.track.status ) {
                return
            }
            // 将播放状态设置为 true，防止重复调用
            this.track.status = true
            // 记录开始播放的真实时间
            let startTimestamp = (new Date()).getTime()
            // 开启计时器
            this.track.interval = setInterval(() => {
                // 每次计时器循环都将轨迹播放时间戳自增，自增值可以通过修改 this.track.speed 来控制
                // 播放倍速 = this.track.speed / 100
                this.track.timestamp += this.track.speed

                // 渲染轨迹播放点的名称，而不渲染位置
                this.renderCurrentTrack(true, false)

                // 根据当前轨迹播放的时间戳，寻找需要参与播放的轨迹点
                // 从上一个被播放到的轨迹点开始，根据只要往后的轨迹时间小于或等于当前轨迹的播放时间戳则视为需要播放
                // 只要遇到一个时间大于当前轨迹播放时间戳的轨迹点则结束这个for循环，这就是要求调用者自行将轨迹点排好序的原因
                for(let i = this.track.current + 1; i <= this.track.points.length - 1; i++) {
                    let next = this.track.points[i]
                    if( next && (new Date(next.time)).getTime() <= this.track.timestamp ) {
                        // 当前播放点的名称和位置
                        this.renderCurrentTrack(true, true)
                        this.track.current++
                        this.$emit('track-next', this.track.current)

                        // 如果当前播放的估计点已经是最后一个轨迹点则调用 stopTrack 方法退出轨迹播放
                        if( this.track.current >= this.track.points.length - 1 ) {
                            this.stopTrack()

                            // 如果播放后很快就触发了结束播放，则触发播放太快的事件
                            if( this.track.points.length > 10 && (new Date()).getTime() - startTimestamp <= 10 * 1000 ) {
                                this.$emit('track-play-too-fast')
                            }
                            return
                        }
                        continue
                    }
                    break
                }
            }, 100)
        },

        /**
         * 暂停轨迹回放
         * 暂停回放后，可重新调用 startTrack 方法从当前位置继续播放
         */
        pauseTrack() {
            this.track.status = false
            clearInterval(this.track.interval)
            this.$emit('track-paused')
        },

        /**
         * 停止轨迹回放
         * 停止回放后，再次调用 startTrack 将从第一个轨迹点开始播放
         */
        stopTrack() {
            this.track.status = false
            clearInterval(this.track.interval)
            this.track.timestamp = this.track.firstTimestamp
            this.track.current = 0
            this.renderCurrentTrack(true, true)
            this.$emit('track-stopped')
        },

        /**
         * 关闭轨迹回放
         * 关闭轨迹回放后，若需要重新播放需再次调用 openTrack 方法
         */
        closeTrack() {
            this.track.options = Object.assign({
                start: {
                    width: 32,
                    height: 32,
                    name: '起点',
                    image: 'https://huawei-v3-web.oss-cn-hangzhou.aliyuncs.com/pc-static/images/marker-begin-icon.png'
                },
                end: {
                    width: 32,
                    height: 32,
                    name: '终点',
                    image: 'https://huawei-v3-web.oss-cn-hangzhou.aliyuncs.com/pc-static/images/marker-end-icon.png'
                },
                current: {
                    width: 24,
                    height: 24,
                    image: 'https://huawei-v3-web.oss-cn-hangzhou.aliyuncs.com/pc-static/images/marker-track-current-icon.png'
                },
            }, this.trackConfig)

            if( typeof this.track.options.getName !== 'function' ) {
                this.track.options.getName = (p, t) => t
            }

            if( this.track.status ) {
                clearInterval(this.track.interval)
            }
            this.track.points = []
            this.track.current = 0
            this.track.speed = 6000
            this.track.status = false
            this.track.timestamp = 0
            this.track.firstTimestamp = 0
            this.track.lastTimestamp = 0
            this.removeMarker('V-MAP-TRACK-START-POINT')
            this.removeMarker('V-MAP-TRACK-END-POINT')
            this.removeMarker('V-MAP-TRACK-CURRENT-POINT')
            this.removeLine('V-MAP-TRACK')
            this.$emit('track-closed')
        },

        /**
         * 设置当前轨迹播放的时间
         * 设置的时间戳必须在轨迹列表中第一个点和最后一个点对应的时间范围之间，否则不会有任何效果
         * 设置时间成功后会自动匹配最接近轨迹点，当匹配到的轨迹点和当前播放的轨迹点不一致时会触发 track-next 事件
         * @param {int} timestamp 毫秒时间戳
         */
        setTrackTime(timestamp) {
            if( this.track.firstTimestamp <= timestamp && this.track.lastTimestamp >= timestamp ) {
                this.track.timestamp = timestamp
                this.onTrackTimestampChange()
            }
        },

        /**
         * 设置轨迹播放的倍速
         * 播放倍速 = speed / 100
         * @param {int} speed
         */
        setTrackSpeed(speed) {
            this.track.speed = speed
        },

        /**
         * 轨迹回放进度条被调整后的事件
         * 需要根据调整后的时间值，循环出最接近但不超过该时间的一个轨迹点作为当前的播放进度
         */
        onTrackTimestampChange() {
            let point
            let current = 0
            for (let index in this.track.points) {
                point = this.track.points[index]
                if( new Date(point.time).getTime() >= this.track.timestamp ) {
                    current = index - 1
                    break
                }
            }
            // 异常处理：不要超过最大值，也不要小于0
            current = current < 0 ? 0 : current
            current = current > this.track.points.length - 1 ? this.track.points.length - 1 : current
            if( this.track.current !== current ) {
                this.track.current = current
                this.renderCurrentTrack(true, true)
                this.$emit('track-next', this.track.current)
            }
        },

        /**
         * 渲染当前轨迹点
         * @param {boolean} name 是否渲染时间
         * @param {boolean} position 是否渲染位置
         */
        renderCurrentTrack(name = true, position = true) {
            let current = this.getMarker('V-MAP-TRACK-CURRENT-POINT')
            if( name ) {
                let currentName = this.track.options.getName(this.track.points[this.track.current])
                if(currentName) {
                    current.name = currentName
                }
            }
            if( position ) {
                let point = this.track.points[this.track.current]
                current.setPosition(point.longitude, point.latitude)
            }
            this.updateMarker(current.id)
        },
    },
    mounted() {
        this.bus('renderMap')()
    },
    unmounted() {
        this.closeTrack()
    }
}
</script>

<style scoped>
    .track-control-container {
        position: absolute;
        bottom: 15px;
        right: 15px;
        z-index: 1000;
        width: 518px;
        box-sizing: border-box;
    }

    .button-list {
        width: 278px;
        float: left;
    }

    .speed-container {
        width: 200px;
        float: left;
    }

    .progress-bar {
        border-top: 1px solid #eee;
        margin-top: 10px;
        float: left;
        width: 478px;
    }
    .progress-bar .el-slider,
    .speed-container .el-slider

    {
        padding-left: 9px;
    }
</style>