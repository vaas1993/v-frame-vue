<template>
    <div :id="id" class="full">
    </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'

let AMap = undefined
export default {
    name: "AMap",
    props: {
        render: {
            type: Function
        }
    },
    data() {
        return {
            id: 'a-map-' + Math.random(),
            AMap: undefined,
            map: undefined,

            ruleTool: undefined,

            lineList: {},

            rectangle: {
                tool: undefined,
                editor: undefined,
                painter: undefined
            }
        }
    },
    methods: {
        renderMap() {
            let options = {
                "version": "2.0",
                "plugins": [
                    'AMap.ToolBar',
                    'AMap.Scale',
                    'AMap.MapType',
                    'AMap.RangingTool',
                    'AMap.Rectangle',
                    'AMap.RectangleEditor',
                    'AMap.MouseTool',
                ],
                "instanceOptions": {
                    animateEnable: false
                }
            }

            if (typeof this.render === 'function') {
                options = this.render(options)
            }

            AMapLoader.load(options).then(_AMAP => {
                AMap = _AMAP
                this.map = new AMap.Map(this.id, options.instanceOptions || {})

                if (AMap.ToolBar) {
                    this.map.addControl(new AMap.ToolBar());
                }
                if (AMap.Scale) {
                    this.map.addControl(new AMap.Scale());
                }
                if (AMap.MapType) {
                    this.map.addControl(new AMap.MapType());
                }
                if (AMap.RangingTool) {
                    this.ruleTool = new AMap.RangingTool(this.map)
                }
                if (AMap.Rectangle) {
                    this.rectangle.render = new AMap.Rectangle({})
                    this.rectangle.render.setMap(this.map)
                }
                if(AMap.MouseTool) {
                    this.rectangle.painter = new AMap.MouseTool(this.map)
                }
                this.$emit('mounted')
            })
        },

        getVersion() {
            return AMap.v && AMap.v.split('.')[0] === '1' ? 1 : 2
        },

        setCenter(position, zoom = null) {
            position = new AMap.LngLat(position.longitude, position.latitude)
            this.map.setCenter(position, false)
            if (zoom) {
                this.setZoom(zoom)
            }
        },

        setZoom(zoom) {
            this.map.setZoom(zoom, false)
        },
        getZoom() {
            return this.map.getZoom()
        },
        setOptimalZoom() {
            this.map.setFitView('', false, [20, 20, 20, 20])
        },
        addMarker(marker) {
            this.map.add(this.instanceToAMap(marker))
        },
        updateMarker(marker) {
            this.instanceToAMap(marker)
        },
        removeMarker(marker) {
            this.map.remove(this.instanceToAMap(marker))
        },
        openInfoWindow(marker) {
            let html = marker.getInfoWindowHTML()
            let instance = new AMap.InfoWindow({
                content: html,
            })
            instance.setOffset(new AMap.Pixel(0, -1 * marker.height - 6))
            instance.anchor = 'bottom-center'

            instance.open(
                this.map,
                new AMap.LngLat(marker.longitude, marker.latitude)
            )
            instance.on('close', () => {
                this.$emit('info-window-close', marker)
            })
        },

        closeInfoWindow() {
            this.map.clearInfoWindow()
        },

        /**
         * 将字符串中的半角字符全部转成全角字符
         * @param str
         * @returns {*}
         */
        strToDBC(str) {
            let result = ''
            for (let i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) === 32) {
                    result += String.fromCharCode(12288);
                } else if (str.charCodeAt(i) < 127) {
                    result += String.fromCharCode(str.charCodeAt(i) + 65248);
                } else {
                    result += str[i]
                }
            }
            return result;
        },

        /**
         * 转换成高德地图德覆盖物
         * @returns {object}
         */
        instanceToAMap(marker) {
            let version = this.getVersion()

            let getImage = () => {
                let icon
                let image = marker.getImage()
                if (image) {
                    icon = new AMap.Icon({
                        image,
                        size: new AMap.Size(marker.width, marker.height),
                        imageSize: new AMap.Size(marker.width, marker.height),
                    })
                }
                return icon
            }

            let getName = () => {
                let name
                if (marker.name) {
                    let nameOffset = 0

                    if (version === 1) {
                        nameOffset = new AMap.Pixel(((12 * marker.name.length + 26 - marker.width) / -2), marker.height + 4)
                    }
                    if (version === 2) {
                        nameOffset = new AMap.Pixel((-6 * marker.name.length) - (marker.width / 2) - 13, marker.height)
                    }

                    let content = "<div class='br-primary br-1 text-black-8 bgg-white'>" + this.strToDBC(marker.name) + "</div>"

                    name = {
                        content, // 文本转为全角，不然 offset 计算文本长度时会有问题
                        offset: nameOffset,
                    }
                }
                return name
            }

            let position = new AMap.LngLat(marker.longitude, marker.latitude)

            if (!marker.instance) {
                let options = {
                    extData: marker,
                }

                let offsetConfig = marker.offset.split(',')

                options.anchor = offsetConfig[1] + '-' + (offsetConfig[0] === 'middle' ? 'center' : offsetConfig[0])
                options.anchor = options.anchor === 'middle-center' ? 'center' : options.anchor
                options.offset = new AMap.Pixel(0,0)

                marker.instance = new AMap.Marker(options)

                marker.instance.on('click', () => {
                    this.$emit('marker-click', marker)
                })
            }

            marker.instance.setPosition(position)
            marker.instance.setLabel(getName())

            let image = getImage()
            if (image) {
                marker.instance.setIcon(image)
            }

            let name = getName()
            if (name) {
                marker.instance.setLabel(name)
            }

            marker.visible ? marker.instance.show() : marker.instance.hide()

            return marker.instance
        },

        openRule() {
            this.ruleTool.turnOn()
        },
        closeRule() {
            this.ruleTool.turnOff()
        },

        openRectangle(rightTop, leftBottom) {
            rightTop = new AMap.LngLat(rightTop[0], rightTop[1])
            leftBottom = new AMap.LngLat(leftBottom[0], leftBottom[1])
            let bounds = new AMap.Bounds(rightTop, leftBottom)

            this.rectangle.render.setBounds(bounds)

            this.rectangle.render.show()
            this.rectangle.editor = new AMap.RectangleEditor(this.map, this.rectangle.render)

            for(let eventName of ['move', 'adjust']) {
                this.rectangle.editor.on(eventName, target => {
                    this.$emit('rectangle-change',
                        target.bounds.northEast.toArray(),
                        target.bounds.southWest.toArray())
                })
            }
            this.rectangle.editor.open()
        },

        async openNewRectangle() {
            return new Promise(next => {
                this.rectangle.painter.rectangle({
                    fillColor:'#3b9af9',
                    strokeColor:'#3b9af9',
                    strokeWeight: 4
                })
                // 添加绘制事件
                this.rectangle.painter.on('draw', e => {
                    let bounds = e.obj.getBounds()
                    if( JSON.stringify( bounds.southWest.pos ) === JSON.stringify( bounds.northEast.pos ) ) {
                        next(null)
                        return
                    }

                    let p1 = bounds.northEast.toArray()
                    let p2 = bounds.southWest.toArray()

                    next([p1, p2])
                })
            })

        },

        closeRectangle() {
            this.rectangle.render && this.rectangle.render.hide()
            this.rectangle.editor && this.rectangle.editor.close()
            this.rectangle.painter && this.rectangle.painter.close(true)
        },

        addLine(id, points) {
            // 如果折线已存在则将其删除
            if( this.lineList[id] ) {
                this.removeLine(id)
            }

            this.lineList[id] = new AMap.Polyline({
                path: points,
                strokeWeight: 6,
                strokeColor:'#67C23A',
                fillColor:'#67C23A',
                lineJoin: 'round'
            })

            this.map.add(this.lineList[id])
        },

        removeLine(id) {
            if( this.lineList[id] ) {
                this.map.remove(this.lineList[id])
                delete this.lineList[id]
            }
        }
    },
}
</script>

<style>
.amap-marker-label {
    padding: 0;
    border: none;
    background: none;
}

.amap-marker-label > div {
    padding: 6px 12px;
}
</style>