<template>
    <div class="height-100">
        <div class="width-80 text-justify">
            <div class="text-extra-large text-bold mb-2">
                概述
            </div>
            VF将提示分为 加载中、轻提示、重提示、对话框 四种类型，以满足不同的场景所需。
        </div>


        <div class="width-80 text-justify">
            <h2>轻加载</h2>
            轻加载会在页面顶部显示一个加载中的条状组件，用来提示用户当前后台有操作正在进行中，你可以前往 components/VLoadingBar 组件修改样式
            使用方法：
            <pre>
# 显示
VFrame.getInstance().showLoading()
# 隐藏
VFrame.getInstance().hideLoading()
            </pre>
            <div>点击这两个按钮试试：</div>

            <div class="mv-2">
                <el-button type="primary" @click="onLoadingBarShow">显示</el-button>
                <el-button type="primary" :disabled="$vf.loading===0" plain @click="onLoadingBarHide" style="z-index: 5001; position: relative;">隐藏</el-button>
            </div>

            <div>
                每调用一次 showLoading 方法，就会给全局一个整型变量自增1，只要这个全局变量不为0，加载状态就会一直显示。
            </div>


            <h2>全屏加载</h2>
            全屏加载会显示一个覆盖全屏的加载组件，用在一些需要中断用户操作的加载操作，你可以前往 components/VLoading 组件修改样式
            使用方法：
            <pre>
                <v-loading v-if="isLoading"></v-loading>
在需要的页面使用 &lt;v-loading&gt;&lt;/v-loading&gt;
            </pre>
            <div>点击这两个按钮试试：</div>

            <div class="mv-2">
                <el-button type="primary" @click="onLoadingShow">显示</el-button>
                <el-button type="primary" :disabled="!isLoading" plain @click="onLoadingHide" style="z-index: 6001; position: relative;">隐藏</el-button>
            </div>


            <h2>轻提示</h2>
            使用方法：
            <pre>
VFrame.getInstance().showToast({
    message: String,
    type: String,
    duration: Number,
    showClose: Boolean,
})
            </pre>
            <div>根据方法接受的四个参数，可以自由组合出想要的效果，可以在这里试试：</div>

            <div class="mv-2">
                <div class="mb-1">
                    <el-button type="success" @click="onToastShow('白日依山尽', 'success', 5000, true)">
                        成功的提示（type = success）、5秒后自动关闭，显示关闭按钮
                    </el-button>
                </div>
                <div class="mb-1">
                    <el-button type="warning" @click="onToastShow('黄河入海流', 'warning', 3000, false)">
                        警告的提示（type = warning）、3秒后自动关闭，不显示关闭按钮
                    </el-button>
                </div>
                <div class="mb-1">
                    <el-button type="danger" @click="onToastShow('欲穷千里目', 'error', 30000, true)">
                        错误的提示（type = error）、30秒后自动关闭，显示关闭按钮
                    </el-button>
                </div>
                <div class="mb-1">
                    <el-button type="info" @click="onToastShow('更上一层楼', 'info', 3000, false)">
                        普通的提示（type = undefined || info）、3秒后自动关闭，不显示关闭按钮
                    </el-button>
                </div>
            </div>



            <h2>重提示</h2>
            使用方法：
            <pre>
VFrame.getInstance().showNotify({
    title: String,
    message: String,
    type: String,
    duration: Number,
    showClose: Boolean,
    html: Boolean
})
            </pre>
            <div class="mv-2">
                <div class="mb-1">
                    <el-button type="success" @click="onNotifyShow('登鹳雀楼','白日依山尽', 'success', 5000, true)">
                        成功的提示、5秒后自动关闭，显示关闭按钮
                    </el-button>
                </div>
                <div class="mb-1">
                    <el-button type="warning" @click="onNotifyShow('登鹳雀楼','黄河入海流', 'warning', 3000, false)">
                        警告的提示、3秒后自动关闭，不显示关闭按钮
                    </el-button>
                </div>
                <div class="mb-1">
                    <el-button type="danger" @click="onNotifyShow('登鹳雀楼','欲穷千里目', 'error', 30000, true)">
                        错误的提示、30秒后自动关闭，显示关闭按钮
                    </el-button>
                </div>
                <div class="mb-1">
                    <el-button type="info" @click="onNotifyShow('登鹳雀楼','更上一层楼', 'info', 0, true)">
                        普通的提示、不自动关闭，显示关闭按钮，不兼容HTML
                    </el-button>
                </div>
                <div class="mb-1">
                    <el-button type="info" @click="onNotifyShow('登鹳雀楼','<span style=\'color: red;\'>我是红色字</span>', 'info', 6000, false, true)">
                        兼容HTML
                    </el-button>
                </div>
                <div class="mb-1">
                    <el-button type="info" @click="onNotifyShow('登鹳雀楼','<span style=\'color: red;\'>我不兼容HTML，所以我不是红色字</span>', 'info', 6000, false, false)">
                        不兼容HTML
                    </el-button>
                </div>
            </div>



            <h2>对话框</h2>
            使用方法：
            <pre>
VFrame.getInstance().showDialog({
    title: String,
    message: String,
    type: String,
    showClose: Boolean,
    showCancel: Boolean,
    showConfirm: Boolean,
    cancelText: String,
    confirmText: String,
    callback: Function
})
            </pre>
            <div class="mv-2">
                <div class="mb-1">
                    <el-button type="success" @click="onDialogShow('这是一个消息提示', '提示相当的到位', false, true, 'success')">
                        消息提示
                    </el-button>
                    <el-button
                        type="warning"
                        @click="onDialogShow('这是一个确认消息', '你确定1+1=2吗？', true, true, 'warning', () => {$vf.showToast({message: '你可以通过回调函数字段处理点击后的事件'})})"
                    >
                        确认消息
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import VFrame from "@vshen/v-frame-core/lib/VFrame";
import VLoading from "../../components/VLoading"

export default {
    name: "index",
    components: {VLoading},
    data() {
        return {
            isLoading: false
        }
    },
    methods: {
        onLoadingShow() {
            this.isLoading = true
        },
        onLoadingHide() {
            this.isLoading = false
        },
        onLoadingBarShow() {
            VFrame.getInstance().showLoading()
        },
        onLoadingBarHide() {
            VFrame.getInstance().hideLoading()
        },
        onToastShow(message, type, duration, showClose) {
            VFrame.getInstance().showToast({
                message, type, duration, showClose
            })
        },
        onNotifyShow(title, message, type, duration, showClose, html) {
            VFrame.getInstance().showNotify({
                title,
                message,
                type,
                duration,
                showClose,
                html
            })
        },
        onDialogShow(title, message, showCancel, showConfirm, type, callback) {
            VFrame.getInstance().showDialog({
                title,
                type,
                message,
                showCancel,
                showConfirm,
                callback
            })
        }
    }
}
</script>

<style scoped>

</style>