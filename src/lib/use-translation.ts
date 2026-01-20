import { useTheme } from "@/lib/theme-context";
import { getTranslation, TranslationKey } from "@/lib/translations";

export function useTranslation() {
  const { language } = useTheme();

  return {
    t: (key: TranslationKey) => getTranslation(language, key),
    language,
  };
}
