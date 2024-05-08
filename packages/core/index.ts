import {makeInstaller} from '@melon-element/utils'
import componets from './components'
import '@melon-element/theme/index.css'
const installer = makeInstaller(componets)

export * from '@melon-element/components'
export default installer