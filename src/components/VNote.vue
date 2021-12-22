<template>
    <div
        class="note-container fixed bgg-white br-1"
        :class="'note-container-' + id + ' ' + ($vf.note?.id === id ? 'bs-2' : 'bs-1')"
        ref="note"
        :style="{zIndex: $vf.note?.id === id ? 5001 : 5000}"
        @mousedown="$vf.note.id = id"
    >
        <div class="note-header text-base pa-1" :class="headerClass" @mousedown="onMoveStart" ref="header">
            <span>
                {{name}}
            </span>
            <div class="float-right" @mousedown.stop="">
                <el-button size="mini" circle type="warning" v-if="isOpen" @click="isOpen = false">
                    <v-icon icon="icon-reduce-1"></v-icon>
                </el-button>
                <el-button size="mini" circle type="success" v-if="!isOpen" @click="isOpen = true">
                    <v-icon icon="icon-zoom-1"></v-icon>
                </el-button>
                <el-button size="mini" circle type="danger" @click="onClose">
                    <v-icon icon="icon-close-1"></v-icon>
                </el-button>
            </div>
        </div>

        <div class="note-body pa-1" v-show="isOpen">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import VIcon from "./VIcon";
/**
 * 便签组件
 */
export default {
    name: "VNote",
    components: {VIcon},
    data() {
        return {
            isOpen: true,
            isMoving: false,
            point: {
                x: undefined,
                y: undefined
            },
        }
    },
    props: {
        id: {
            type: String,
            required: true
        },

        type: {
            type: String,
            default: 'primary'
        },

        name: {
            type: String,
            default: '便签'
        },

        width: {
            type: String,
            default: '300px'
        },

        height: {
            type: String,
            default: 'auto'
        },

        top: {
            type: String,
            default: '15vh'
        },

        left: {
            type: String,
            default: '315px'
        }
    },
    computed: {
        style() {
            return {
                width: this.width,
                height: this.height,
                top: this.top,
                left: this.left,
            }
        },

        headerClass() {
            let classList = []
            switch (this.type) {
                case 'primary':
                case 'warning':
                case 'error':
                    classList.push('bgg-' + this.type)
                    classList.push('text-white')
                    break
                case 'info':
                    classList.push('bgg-white')
                    break
            }
            return classList.join(' ')
        }
    },
    methods: {
        onClose() {
            this.$emit('close', this.id)
        },

        onMoved() {
            this.point.x = 0
            this.point.y = 0
            this.$refs.header.style.cursor = 'default'

            window.removeEventListener('mousemove', this.onMoving, this)
            window.removeEventListener('mouseup', this.onMoved, this)
        },

        onMoveStart(event) {
            this.point.x = event.clientX
            this.point.y = event.clientY
            this.$refs.header.style.cursor = 'move'

            window.addEventListener('mousemove', this.onMoving, this)
            window.addEventListener('mouseup', this.onMoved, this)
        },

        onMoving(event) {
            let left = this.$refs.note.offsetLeft  + ( event.clientX - this.point.x )
            let top = this.$refs.note.offsetTop + ( event.clientY - this.point.y)

            left = left < 0 ? 0 : left
            top = top < 0 ? 0 : top
            left = left > window.innerWidth - this.$refs.note.clientWidth ? window.innerWidth - this.$refs.note.clientWidth : left
            top = top > window.innerHeight - this.$refs.note.clientHeight ? window.innerHeight - this.$refs.note.clientHeight : top

            this.$refs.note.style.left = left + 'px'
            this.$refs.note.style.top = top + 'px'
            this.point.x = event.clientX
            this.point.y = event.clientY
        },

    },
    mounted() {
        this.$refs.note.style.top = this.top
        this.$refs.note.style.left = this.left
        this.$refs.note.style.width = this.width
        this.$refs.note.style.height = this.height

        this.$vf.note = {
            id: this.id,
        }
    }
}
</script>

<style scoped>
.note-container {
    overflow: hidden;
}

.note-body {
    border-top: 1px solid #eee;
}
</style>