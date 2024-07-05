import {useTranslation} from "react-i18next";

export const HomePage = () => {

  const {t} = useTranslation()

  return <>
    <div>{t('HOME_PAGE_TITLE')}</div>
  </>
}
