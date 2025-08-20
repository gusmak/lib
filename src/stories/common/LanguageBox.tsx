import { useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { Button, ListItemIcon, Menu, MenuItem, NoSsr, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
// icon
import EnglandFlag from 'Assets/Flags/gb.svg';
import IndonesiaFlag from 'Assets/Flags/idn.svg';
import VietnamFlag from 'Assets/Flags/vn.svg';

const LanguageFlag = styled('img')(({ theme }) => {
    return {
        width: theme.spacing(3),
    };
});

const LANGUAGES = ['vi', 'en'];

const LanguageBox = () => {
    const { t, i18n } = useTranslation();
    const [languageMenu, setLanguageMenu] = useState<null | HTMLElement>(null);

    const handleLanguageIconClick = (event: MouseEvent<HTMLButtonElement>) => {
        setLanguageMenu(event.currentTarget);
    };

    const handleLanguageMenuClose = (event: MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget.nodeName === 'A') {
            document.cookie = `userLanguage=${event.currentTarget.lang};path=/;max-age=31536000`;
        }
        setLanguageMenu(null);
    };
    const handleChangeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setLanguageMenu(null);
    };
    const vietnameFlagImg = <LanguageFlag src={VietnamFlag} alt="vietnam-flag" />;
    const englandFlagImg = <LanguageFlag src={EnglandFlag} alt="england-flag" />;
    const indonesiaFlagImg = <LanguageFlag src={IndonesiaFlag} alt="indonesia-flag" />;
    const getFlag = (lang: string = '') => {
        const tmpLang = lang || i18n.language;
        switch (tmpLang) {
            case 'vi':
                return vietnameFlagImg;
            case 'id':
                return indonesiaFlagImg;
            default:
                return englandFlagImg;
        }
    };

    return (
        <>
            <Tooltip title={t('Common.ChangeLanguage').toString()} enterDelay={300}>
                <Button
                    id="language-button"
                    color="inherit"
                    size="small"
                    aria-haspopup="true"
                    aria-owns={languageMenu ? 'language-menu' : undefined}
                    onClick={handleLanguageIconClick}
                    endIcon={<KeyboardArrowDownIcon />}
                >
                    {getFlag()}
                </Button>
            </Tooltip>
            <NoSsr defer>
                <Menu
                    id="language-menu"
                    anchorEl={languageMenu}
                    open={Boolean(languageMenu)}
                    onClose={handleLanguageMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    {LANGUAGES.map((lang) => (
                        <MenuItem key={lang} selected={i18n.language === lang} onClick={() => handleChangeLanguage(lang)}>
                            <ListItemIcon>{getFlag(lang)}</ListItemIcon>
                            {t(`Language.${capitalize(lang)}`)}
                        </MenuItem>
                    ))}
                </Menu>
            </NoSsr>
        </>
    );
};
export default LanguageBox;
