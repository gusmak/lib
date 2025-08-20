import { useEffect, useState, Fragment, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Popper, ButtonBase, ClickAwayListener } from '@mui/material';
import { ArrowDropDown as ArrowDropDownIcon, ArrowDropUp as ArrowDropUpIcon } from '@mui/icons-material';
import { useDirectoryTreeStyles } from './components/Styled';
import FilterTreeView from './FilterTreeView';
import { DirectoryTreeProps, Value, TreeItemOption } from './interface';

function DirectoryTree(props: DirectoryTreeProps) {
    const { labelSearch, titleSearch, options, rootDirectoryId, defaultValue, onChange, onDirectoryOpen } = props;

    const { t } = useTranslation();
    const classes = useDirectoryTreeStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedValue, setSelectedValue] = useState<TreeItemOption | undefined>(undefined);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        const selected = options.find((x) => x.value === defaultValue);
        setSelectedValue(selected);
    }, [defaultValue]);

    const handleClose = () => {
        if (selectedValue?.value && selectedValue?.value !== '') onChange(selectedValue?.value);
        setAnchorEl(null);
    };

    const handleSelectDirectoryTree = (id: Value) => {
        var item = options.find((x) => x.value === id);
        setSelectedValue(item);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'github-label' : undefined;

    return (
        <Fragment>
            <div className={classes.root}>
                <ButtonBase disableRipple className={classes.button} aria-describedby={id} onClick={handleClick}>
                    <span>{labelSearch}</span>
                    {anchorEl == null ? <ArrowDropDownIcon fontSize="large" /> : <ArrowDropUpIcon fontSize="large" />}
                </ButtonBase>
            </div>
            <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" className={classes.popper}>
                <ClickAwayListener onClickAway={handleClose}>
                    <div>
                        <div className={classes.header}>{titleSearch ?? `${t('Common.Select')} ${labelSearch.toLocaleLowerCase()}`}</div>
                        <div className={classes.contentDirectoryTree}>
                            <FilterTreeView
                                rootDirectoryId={rootDirectoryId}
                                items={options}
                                onDirectoryOpen={(id) => onDirectoryOpen && onDirectoryOpen(id)}
                                onTreeItemClick={handleSelectDirectoryTree}
                            />
                        </div>
                    </div>
                </ClickAwayListener>
            </Popper>
        </Fragment>
    );
}

export default DirectoryTree;
