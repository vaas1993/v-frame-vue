<template>
    <el-select
        filterable
        remote
        :remote-method="onSearch"
        v-model="value"
        :clearable="clearable"
        class="width-100"
        :placeholder="placeholder"
        @change="onChange"
    >
        <template
            v-for="item of items"
            :key="item[valueField]"
        >
            <el-option
                :label="getName(item)"
                :value="item[valueField]"
                v-if="ignoreList.indexOf(item[valueField]) === -1"
                :disabled="disabledList.indexOf(item[valueField]) !== -1"
            >
            </el-option>
        </template>
    </el-select>
</template>

<script>
import Api from "@vshen/v-frame-core/lib/helpers/Api"

/**
 * 远程下拉
 * 用来调用配置好的列表接口，将返回值作为下拉的待选项
 */
export default {
    name: "VAjaxSelect",
    props: {
        clearable: {
            type: Boolean,
            default: true
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
        nameField: {
            type: String,
            default: 'name'
        },
        valueField: {
            type: String,
            default: 'id'
        },
        searchField: {
            type: String,
            default: 'name'
        },
        apiName: {
            type: String,
            required: true
        },
        searchParams: {
            type: Object,
        },
        symbol: {
            type: String,
            default: '-'
        },
        ignoreList: {
            type: Array,
            default: () => []
        },
        disabledList: {
            type: Array,
            default: () => []
        },
        method: {
            type: String,
            default: 'GET'
        },
        value: {}
    },
    data() {
        return {
            modelValue: this.value,
            searchTimeoutInstance: undefined,
            items: []
        }
    },
    watch: {
        value() {
            this.modelValue = this.value
        }
    },
    methods: {
        onChange() {
            this.$emit('update:modelValue', this.modelValue)
        },

        getName(item) {
            let fieldList = this.nameField || 'name'
            fieldList = fieldList.split(',')
            let name = []
            for(let field of fieldList) {
                name.push(item[field])
            }
            return name.filter(v=>!!v).join(this.symbol)
        },
        onSearch(value) {
            clearTimeout(this.searchTimeoutInstance)
            this.searchTimeoutInstance = setTimeout(async () => {
                let params = Object.assign({}, this.searchParams || {})
                params[this.searchField] = value
                let api = Api.getInstance().setApiName(this.apiName)

                let response
                if( this.method.toUpperCase() === 'POST' ) {
                    response = await api.setPostParams(params).post()
                }
                else if( this.method.toUpperCase() === 'RAW' ) {
                    response = await api.setPostParams(params).raw()
                }
                else {
                    response = await api.setGetParams(params).get()
                }

                if( response.getIsSuccess() ) {
                    this.items = response.data.items
                }
            }, 500)
        }
    },
    mounted() {
        this.onSearch()
    }
}
</script>

<style scoped>

</style>