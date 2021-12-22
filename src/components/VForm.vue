<template>
    <div class="v-form relative hidden width-100">
        <v-overlay v-show="isLoading"></v-overlay>
        <div class="v-form-items hidden" :class="adaption ? 'adaption-container' : ''">
            <template v-for="(item, field) of formSchema" :key="field">
                <slot :name="'before-' + field"></slot>
                <div class="v-form-item" :class="'v-form-item--' + field" v-bind="item.options || {}">
                    <div v-if="isLabelShow" class="text-base relative v-form-item-name">
                        <span class="text-danger" v-if="formModel.getIsRequired(field)">*</span>
                        <span>
                            {{item.label || formModel.getLabel(field)}}
                        </span>
                        <el-popover
                            v-if="item.description"
                            placement="bottom"
                            :width="400"
                            trigger="hover"
                            :content="item.description"
                        >
                            <template #reference>
                                <v-icon
                                    class="text-pointer text-warning lh-1"
                                    style="margin-left: 5px;"
                                    icon="icon-question-1"
                                ></v-icon>
                            </template>
                        </el-popover>
                    </div>

                    <div>
                        <component
                            v-bind:is="item.component.widget"
                            v-bind="item.component.options || {}"
                            v-on="item.component.events || {}"
                            v-model="formData[field]"
                            @field-change="onFieldChange"
                        ></component>
                    </div>

                    <div v-if="isErrorMessageShow" class="text-danger v-form-error lh-1 hidden ellipsis" :title="formModel.getErrors(field).join('、')">
                        {{formModel.getErrors(field).join('、') || '&nbsp;'}}
                    </div>
                </div>
                <slot :name="'after-' + field"></slot>
            </template>
        </div>
        <div class="v-form-action" v-if="isActionShow">
            <el-button
                v-for="(button, index) of formModel.getFormActionList()"
                :key="index"
                v-bind="button.options"
                @click="onActionClick(button)"
                :loading="isLoading"
            >
                {{button.name}}
            </el-button>
        </div>
    </div>
</template>

<script>
import VIcon from "./VIcon";
import ObjectHelper from "@vshen/v-frame-core/src/helpers/ObjectHelper";
import VOverlay from "./VOverlay";
export default {
    name: "VForm",
    components: {VOverlay, VIcon},
    props: {
        /**
         * 模型实例
         * 不可为空
         */
        formModel: {
            type: Object,
            required: true,
        },

        /**
         * 表单配置
         * 为空时将调用 this.formModel.getFormConfig() 获取
         */
        formConfig: {
            type: Object,
        },

        /**
         * 是否要展示字段标签
         * 默认为 true
         */
        isLabelShow: {
            type: Boolean,
            default: true
        },

        /**
         * 是否在出现错误时展示错误信息
         * 默认为 true
         */
        isErrorMessageShow: {
            type: Boolean,
            default: true
        },

        /**
         * 是否展示组件自带的操作按钮
         * 默认为 true
         */
        isActionShow: {
            type: Boolean,
            default: true
        },

        /**
         * 传入一个函数作为组件自带按钮的处理函数
         * 如果指定了处理函数，将覆盖组件默认的处理逻辑
         */
        actionHandler: {
            type: Function,
        },

        /**
         * 自适应宽度
         * 开启后将使用 flex 布局将所有的表单项都放置在一行内
         * 默认为 false
         */
        adaption: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            // 表单内容，表单项是直接跟这个变量进行绑定的
            formData: {},
            // 是否 loading 状态
            isLoading: false,
        }
    },
    computed: {
        /**
         * 表单的渲染配置
         * 默认从 this.formConfig 中获取值，如果没有传入该值则从 this.formModel.getFormConfig() 取值
         * 这个方法返回配置前会对配置进行一些简单的加工，包括：
         * schema[].options.class = 'width-50'
         * schema[].component.options.clearable = true
         * schema[].component.options.class = 'width-100'
         * schema[].component.options.placeholder = '请输入' + ( schema[].name || this.formModel.getLabel(字段名) )
         * @return {object}
         */
        formSchema() {
            return ObjectHelper.forEach(ObjectHelper.copy(this.formConfig || this.formModel.getFormConfig()), (item, field) => {
                item.options = item.options || {}
                item.options.class = item.options.class || 'width-50'
                item.component = item.component || {}
                item.component.options = item.component.options || {}
                item.component.options.clearable = item.component.options.clearable === undefined ? true : item.component.options.clearable
                item.component.options.class = item.component.options.class || 'width-100'
                item.component.options.placeholder = item.component.options.placeholder || '请输入' + (item.name || this.formModel.getLabel(field))
                return item
            })
        }
    },
    methods: {
        /**
         * 有表单项组件触发，用来修改除了通过 v-model 绑定的字段外的其它字段的值
         * @param {string} field 需要更新的字段
         * @param {any} value 需要更新的值
         */
        onFieldChange({field, value}) {
            this.formData[field] = value
        },

        /**
         * 从模型实例 this.formModel 中读取数据到 this.formData
         * 一般是组件初始化或者外部需要更新数据到组件内部的时候调用
         */
        loadDataFromModel() {
            this.formData = this.formModel.getSources()
        },

        /**
         * 提交数据到模型实例
         * 表单的操作数据不会直接绑定到模型实例中，需要同步时可以手动调用这个方法
         */
        submitDataToModel() {
            this.formModel.setSources(this.formData)
        },

        /**
         * 组件自带操作按钮的点击事件
         * 当按钮被点击时，将自动调用模型实例对应的方法：方法名 = "onForm" + 首字母大写( button.type )
         * 具体的逻辑可以在模型实例中处理
         * 调用模型方法后，如果返回 Promise，则组件进入 loading 状态，在 Promise 完成后结束 loading 状态
         * @param {object<type,submit>} button 被点击的按钮
         */
        onActionClick(button) {
            if( !button.type ) {
                console.error('若需要在模型实例中处理该表单按钮点击事件，请给按钮配置一个 type 字段')
                return
            }

            // 如果按钮配置了需要自动提交表单数据到模型里，则自动同步
            if( button.submit === true ) {
                this.submitDataToModel()
            }

            // 如果指定了处理函数，则覆盖默认的处理逻辑
            if( typeof this.actionHandler === 'function' ) {
                this.actionHandler(button, this.formData)
                return
            }

            let methodName = button.type.split('')
            methodName[0] = methodName[0].toUpperCase()
            methodName = 'onForm' + methodName.join('')

            if( typeof this.formModel[methodName] !== 'function' ) {
                console.error('组件模型的' + methodName + '必须是一个函数');
                return
            }

            let promise = this.formModel[methodName](() => {
                this.submitDataToModel()
            })
            if( promise instanceof Promise ) {
                this.isLoading = true
                promise.then(() => {
                    this.isLoading = false
                })
            }
        }
    },
    mounted() {
        // 组件加载完成后从模型实例中读取数据到 this.formData
        this.loadDataFromModel()
    }
}
</script>

<style scoped>
.v-form-items {
    margin: 0 -5px;
}

.v-form-item {
    float: left;
    padding: 0 5px;
    box-sizing: border-box;
}

.v-form-error {
    font-size: 14px;
    line-height: 20px;
}

.adaption-container {
    display: flex;
    width: 100%;
    flex-wrap: nowrap;
}

.adaption-container .v-form-item {
    max-width: 300px;
    width: unset;
    flex: 1 1 auto;
}

.v-form-item-name {
    line-height: 20px;
    height: 20px;
}
</style>