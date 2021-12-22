import { createRouter, createWebHistory } from 'vue-router'
import CommonLayout from '../layouts/common/index'
import SiteIndex from '../pages/site/index'
import ListIndex from '../pages/list/index'
import FormIndex from '../pages/form/index'
import NoticeIndex from '../pages/notice/index'
import ModalIndex from '../pages/modal/index'
import MapIndex from '../pages/map/index'
import NoteIndex from '../pages/common/note'
import TreeIndex from '../pages/common/tree'
import Default404 from '../pages/default/404'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: CommonLayout,
            children: [
                {
                    path: '/',
                    component: SiteIndex,
                    meta: {
                        name: '驾驶舱'
                    }
                },
                {
                    path: '/site/index',
                    component: SiteIndex,
                    meta: {
                        name: '驾驶舱'
                    }
                },
                {
                    path: '/form/index',
                    component: FormIndex,
                    meta: {
                        name: '表单'
                    }
                },
                {
                    path: '/list/index',
                    component: ListIndex,
                    meta: {
                        name: '列表'
                    }
                },
                {
                    path: '/notice/index',
                    component: NoticeIndex,
                    meta: {
                        name: '提示'
                    }
                },
                {
                    path: '/modal/index',
                    component: ModalIndex,
                    meta: {
                        name: '模态框'
                    }
                },
                {
                    path: '/map/index',
                    component: MapIndex,
                    meta: {
                        name: '地图'
                    }
                },
                {
                    path: '/common/note',
                    component: NoteIndex,
                    meta: {
                        name: '便签'
                    }
                },
                {
                    path: '/common/tree',
                    component: TreeIndex,
                    meta: {
                        name: '树组件'
                    }
                },
                {
                    path: '/:pathMatch(.*)*',
                    component: Default404,
                    meta: {
                        name: '页面不存在'
                    }
                },
            ]
        }
    ]
})

export default router