import {makeInstaller} from '@melon-element/utils'
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import componets from './components'
import '@melon-element/theme/index.css'

library.add(fas)
const installer = makeInstaller(componets)

export * from '@melon-element/components'
export default installer