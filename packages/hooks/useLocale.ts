import { type Ref, inject } from "vue";
import type { Language } from "@melon-element/locale";
import { omit } from "lodash-es";
import { type I18nInstance, i18nSymbol, createI18n } from "vue3-i18n";
import English from "@melon-element/locale/lang/en";
export function useLocale(localeOverrides?: Ref<Language>) {
  if (!localeOverrides) {
    return omit(
      <I18nInstance>(
        inject(
          i18nSymbol,
          createI18n({ locale: English.name, messages: { en: English.el } })
        )
      ),
      "install"
    );
  }
  return omit(
    createI18n({
      locale: localeOverrides.value.name,
      messages: {
        en: English.el,
        [localeOverrides.value.name]: localeOverrides.value.el,
      },
    }),
    'install'
  );
}
export default useLocale