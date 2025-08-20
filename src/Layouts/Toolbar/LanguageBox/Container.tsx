import { ReactNode, useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { Button, ListItemIcon, Menu, MenuItem, NoSsr, Tooltip, Stack } from '@mui/material';
// icon
import EnglandFlag from '../flag/gb';
import IndonesiaFlag from '../flag/id';
import VietnamFlag from '../flag/vn';
import ThaiLanFlag from '../flag/th';

export type Lang = {
    lang: string;
    icon: ReactNode;
    translateBy?: string;
};

export type LanguageBoxProps = {
    languages?: Lang[];
};

const LanguageBox = (props: LanguageBoxProps) => {
    const { t, i18n } = useTranslation();
    const {
        languages = [
            {
                lang: 'en',
                icon: <EnglandFlag />,
            },
            {
                lang: 'vi',
                icon: <VietnamFlag />,
            },
            {
                lang: 'th',
                icon: <ThaiLanFlag />,
                translateBy: 'AI',
            },
            {
                lang: 'id',
                icon: <IndonesiaFlag />,
                translateBy: 'AI',
            },
        ],
    } = props;

    const [languageMenu, setLanguageMenu] = useState<null | HTMLElement>(null);

    const handleLanguageIconClick = (event: MouseEvent<HTMLButtonElement>) => {
        setLanguageMenu(event.currentTarget);
    };

    const handleLanguageMenuClose = (event: MouseEvent<HTMLButtonElement>) => {
        /* Nếu trong lúc đóng menu, click vào thẻ <a /> */
        if (event.currentTarget.nodeName === 'A') {
            document.cookie = `userLanguage=${event.currentTarget.lang};path=/;max-age=31536000`;
        }
        setLanguageMenu(null);
    };

    const handleChangeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setLanguageMenu(null);
    };

    const getDefaultFlag = () => {
        const tmpLang = i18n.language;

        const crLang = languages.find((l) => l.lang === tmpLang);

        if (crLang) return crLang.icon;
        return <EnglandFlag />;
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
                    <Stack
                        style={{ display: 'flex', alignItems: 'center', width: '25px', height: '17px' }}
                        sx={{
                            '& > svg': {
                                width: '100%',
                                boxShadow:
                                    ' rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px; ',
                            },
                        }}
                    >
                        {getDefaultFlag()}
                    </Stack>
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
                    {languages.map((l, index) => (
                        <MenuItem key={index} id={l.lang} selected={i18n.language === l.lang} onClick={() => handleChangeLanguage(l.lang)}>
                            <ListItemIcon>
                                <Stack
                                    style={{ display: 'flex', alignItems: 'center', width: '25px', height: '17px' }}
                                    sx={{
                                        '& > svg': {
                                            width: '100%',
                                            boxShadow:
                                                ' rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px; ',
                                        },
                                    }}
                                >
                                    {l.icon}
                                </Stack>
                            </ListItemIcon>
                            {t(`Language.${capitalize(l.lang)}`)}{' '}
                            {l.translateBy ? t(`Language.TranslateBy`, { author: l.translateBy }) : null}
                        </MenuItem>
                    ))}
                </Menu>
            </NoSsr>
        </>
    );
};

export default LanguageBox;
