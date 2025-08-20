import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { xor } from 'lodash';
import { Box, Checkbox, FormControlLabel, Grid, Switch } from '@mui/material';
import DataGrid from 'AWING/DataGrid';
import { EnumSelectedPlaceType } from '../Enum';
import { Constants } from 'Commons/Constant';
import { IPages, IPlace, ITag, ITagAll } from '../interface';

interface Props {
    tagsAll: ITagAll;
    tagSelected?: ITag;
    isShowTotalSelected: boolean;
    pages: IPages;
    places: IPlace[];
    totalSelected: number;
    onSelectAll: (checked: boolean) => void;
    onSelectFilter: (checked: boolean) => void;
    onSelect: (checked: boolean, id: string) => void;
    getId: (row: IPlace) => string | undefined;
}

export default function DataTableComponent(props: Props) {
    const { t } = useTranslation();
    const { tagsAll, tagSelected, isShowTotalSelected, pages, places, totalSelected, onSelectAll, onSelectFilter, onSelect, getId } = props;

    useEffect(() => {
        const checkboxs = document.querySelectorAll<HTMLInputElement>('[data-row="row"] [type="checkbox"]');
        checkboxs.forEach((checkbox) => {
            const lable = (checkbox.getAttribute('aria-labelledby') ?? '').split('-');
            const id = lable[lable.length - 1];
            checkbox.disabled = isRowDisabled(id);
        });
    }, [places, tagsAll]);
    function isRowDisabled(id: string) {
        const isChecked = tagsAll?.selectedPlaceIds?.includes(id) || tagsAll?.filterPlaceIds?.includes(id);
        return (tagsAll?.filterPlaceIds?.includes(id) && !tagsAll?.selectedPlaceIds?.includes(id)) || (isShowTotalSelected && !isChecked);
    }
    return (
        <Box
            sx={{
                '.MuiPaper-root': {
                    boxShadow: 'none',
                },
                boxShadow: (t) => t.shadows[1],
                borderRadius: (t) => t.spacing(0.5),
            }}
        >
            <Grid
                container
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: (t) => t.spacing(2),
                    borderBottom: (t) => `1px solid ${t.palette.divider}`,
                }}
            >
                {isShowTotalSelected ? (
                    <>
                        <Grid>
                            <b>
                                {t('PlaceFilter.TotalSelected')}: {totalSelected}
                            </b>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        disabled={tagSelected?.filterPlaceIds && tagSelected?.filterPlaceIds.length > 0}
                                        checked={tagSelected?.selectedPlaceIds?.length === pages.total}
                                        onChange={(e) => {
                                            onSelectAll(e?.target?.checked);
                                        }}
                                    />
                                }
                                label={t('Common.SelectAll')}
                            />
                        </Grid>
                        <Grid>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={tagSelected?.selectedType === EnumSelectedPlaceType.FILTER}
                                        onChange={(e) => onSelectFilter(e?.target?.checked)}
                                    />
                                }
                                label={t('PlaceFilter.SelectAllByFilter')}
                                labelPlacement="start"
                            />
                        </Grid>
                    </>
                )}
            </Grid>
            <DataGrid
                columns={[
                    {
                        field: 'name',
                        headerName: 'Name sdfsdfsd',
                        type: 'text',
                        width: '100%',
                        // dynamicTableCellProps: (row) => {
                        //     return {
                        //         onClick: (e) => {
                        //             e.stopPropagation();
                        //         },
                        //         style: {
                        //             backgroundColor: isRowDisabled(row)
                        //                 ? '#f5f5f5'
                        //                 : 'white',
                        //         },
                        //     };
                        // },
                    },
                ]}
                dynamicTableRowProps={(row) => {
                    const isDisabled = isRowDisabled(row.id + '');
                    const cursor = isDisabled ? 'text' : 'pointer';
                    return {
                        sx: {
                            backgroundColor: isDisabled ? '#f5f5f5' : 'white',
                            '.Mui-checked': {
                                color: (t) => (isDisabled ? t.palette.text.disabled : t.palette.primary.main),
                                cursor,
                            },
                        },
                        style: {
                            cursor,
                        },
                        onClick: (e) => {
                            if (isDisabled) {
                                e.stopPropagation();
                                return;
                            }
                            const checked = !tagsAll.selectedPlaceIds?.includes(row.id + '');
                            onSelect(checked, String(row.id));
                        },
                    };
                }}
                hideHeader
                getRowId={(row) => getId(row) ?? ''}
                onSelectedChange={(selected) => {
                    xor(tagsAll.selectedPlaceIds, selected).forEach((id) => {
                        const checked = selected.includes(id);
                        onSelect(checked, String(id));
                    });
                }}
                selected={tagsAll.selectedPlaceIds?.concat(tagsAll.filterPlaceIds ?? [])}
                rows={places}
                totalOfRows={pages.total}
                pageSize={pages.pageSize}
                pageIndex={pages.pageIndex}
                onPageIndexChange={pages.onPageIndexChange}
                rowsPerPageOptions={Constants.DEFAULT_ROWS_PER_PAGE}
                onPageSizeChange={pages.onPageSizeChange}
            />
        </Box>
    );
}
