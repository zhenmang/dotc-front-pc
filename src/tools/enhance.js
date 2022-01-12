import router from '@/router'
import ElementPlus from 'element-plus'
import LoadingIcon from '@/components/LoadingIcon/LoadingIcon.vue'
import DialogBox from '@/components/DialogBox/DialogBox.vue'
import ConfirmBox from '@/components/ConfirmBox/ConfirmBox.vue'
import UploadPic from '@/components/UploadPic/UploadPic.vue'
import * as ElIcons from '@element-plus/icons'
import 'element-plus/dist/index.css'
import '@/assets/css/resetCss.styl'
import '@/tools/smart-rem.js'
import i18n from '@/language/i18n'

export default {
  install(app) {
    app.use(i18n)
    for (let iconName in ElIcons) {
      app.component(iconName, ElIcons[iconName])
    }
    app.component('LoadingIcon', LoadingIcon)
    app.component('DialogBox', DialogBox)
    app.component('ConfirmBox', ConfirmBox)
    app.component('UploadPic', UploadPic)
    app.use(ElementPlus)
    app.use(router)
  }
}