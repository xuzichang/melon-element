import makeInstaller from './makeInstaller'
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import componets from './components'
import '@melon-element/theme/index.css'
import printLogo from './printLogo'

printLogo()

library.add(fas)
const installer = makeInstaller(componets)

export * from '@melon-element/locale'
export * from '@melon-element/components'
export default installer