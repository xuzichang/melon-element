import { isString } from "lodash-es"

class MelonUIError extends Error{
    constructor(message:string){
        super(message)
        this.name = 'MelonUIError'
    }
}

export function throwError(scope:string,msg:string){
    throw new MelonUIError(`[${scope} ${msg}]`)
}

export function debugWarn(error:Error):void
export function debugWarn(sopce:string,msg:string):void
export function debugWarn(scope:string|Error,msg?:string){
    if(process.env.NODE_ENV!=='production'){
        const err = isString(scope)?new MelonUIError(`[${scope} ${msg}]`):scope
        console.warn(err)
    }
}