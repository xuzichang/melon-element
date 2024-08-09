import type { Language, TranslatePair } from "@melon-element/locale";

export interface ConfigProviderProps{
    locale?:Language
    extendsI18nMsg?:TranslatePair
}