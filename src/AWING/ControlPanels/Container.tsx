import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
    Autocomplete,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DateRange } from 'AWING/DateRangePicker';
import moment, { Moment } from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRangePicker } from '..';
import { TYPE_FILTERS } from './Enums';
import { FiltersType, IControlPanel, QueryInputStatistics } from './Types';

const useStyles = makeStyles(() => ({
    outlinedInput: {
        '& .MuiOutlinedInput-input': {
            padding: '10.5px !important',
        },
        '& .MuiFormControl-marginNormal': {
            margin: '0.5rem',
        },
        '& .MuiOutlinedInput-adornedEnd': {
            paddingRight: '0.25rem',
        },
        '& .MuiAutocomplete-inputRoot': {
            padding: '0.5rem',
        },
        '& .MuiAutocomplete-endAdornment': {
            top: 'calc(50% - 19px)',
        },
    },
}));

const ControlPanels = <F,>({ onChangeQueryInput, initialFilters, isLoadings, disableView = false }: IControlPanel<F>) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [queryInput, setQueryInput] = useState<QueryInputStatistics<F>>();
    const [elementInputs, setElementInputs] = useState<FiltersType<F>[]>([]);
    const [isShowFilterEnhanced, setIsHideFieldAdvanced] = useState<boolean>(false);
    const flagRef = useRef<string | number>('-1');

    const getView = () => {
        onChangeQueryInput(queryInput!);
        flagRef.current = Array.isArray(queryInput?.campaignIds) ? queryInput.campaignIds?.at(-1) : '-1';
    };

    const disabledViewBy =
        (Array.isArray(queryInput?.campaignIds) ? queryInput?.campaignIds?.length : 0) > 0 && Array.isArray(queryInput?.campaignIds)
            ? queryInput?.campaignIds?.includes(flagRef.current)
            : false;

    const handleInitialFilter = (initialFilters: FiltersType<F>[]) => {
        const initValue = initialFilters?.reduce((acc: { [key: string]: F }, curr) => {
            if (curr?.type === TYPE_FILTERS.DATE_RANGE_PICKER) {
                return {
                    ...acc,
                    ...curr?.defaultValue,
                };
            }
            if (curr?.name && curr.initValue !== undefined) {
                acc[curr.name] = curr.initValue;
            }

            return acc;
        }, {});
        return initValue;
    };

    const handleChangeQueryInput = (field: string, value: F) => {
        setQueryInput((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleChangeDateRange = (value: DateRange) => {
        handleChangeQueryInput('startDate', value.startDate as F);
        handleChangeQueryInput('endDate', value.endDate as F);
    };

    const handleElementInput = (initialFilters: FiltersType<F>[]) => {
        const updatedElementInputs: FiltersType<F>[] = [];

        initialFilters.map((item, idx: number) => {
            switch (item?.type) {
                case TYPE_FILTERS.SELECT:
                case TYPE_FILTERS.VIEW_USER:
                case TYPE_FILTERS.VIEW_TIME:
                case TYPE_FILTERS.VIEW_COMPLETION_RATE:
                case TYPE_FILTERS.VIEW_BY: {
                    const element = {
                        ...item,
                        component: (
                            <TextField
                                key={idx}
                                select
                                fullWidth
                                label={item?.label}
                                size="small"
                                {...(item?.type === TYPE_FILTERS.VIEW_TIME ||
                                item?.type === TYPE_FILTERS.VIEW_COMPLETION_RATE ||
                                item?.type === TYPE_FILTERS.SELECT
                                    ? {
                                          onChange: (e) =>
                                              handleChangeQueryInput && handleChangeQueryInput(item?.name!, e.target.value as F),
                                      }
                                    : {
                                          onChange: (e) => item?.onChange && item.onChange(Number(e.target.value) as F),
                                      })}
                                slotProps={{
                                    select: {
                                        native: true,
                                    },
                                }}
                                variant="outlined"
                                style={
                                    item?.type === TYPE_FILTERS.VIEW_BY || item?.type === TYPE_FILTERS.VIEW_TIME
                                        ? {
                                              minWidth: 160,
                                          }
                                        : {
                                              minWidth: 180,
                                          }
                                }
                                {...(!(item?.type === TYPE_FILTERS.VIEW_BY)
                                    ? {
                                          disabled: isLoadings,
                                      }
                                    : {
                                          disabled: isLoadings || !disabledViewBy,
                                      })}
                            >
                                {item?.initialData?.map((data) => {
                                    return (
                                        <option key={`${data.value}`} value={String(data.value)}>
                                            {data.label}
                                        </option>
                                    );
                                    ``;
                                })}
                            </TextField>
                        ),
                        isEnhanced: item?.isEnhanced ? item?.isEnhanced : false,
                        name: item?.name,
                    };
                    updatedElementInputs.push(element);
                    break;
                }
                case TYPE_FILTERS.SEARCH_BY_PLACE: {
                    const element = {
                        ...item,
                        component: (
                            <TextField
                                key={idx}
                                select
                                fullWidth
                                label={t('Common.TitleTypeView')}
                                size="small"
                                onChange={(e) => handleChangeQueryInput && handleChangeQueryInput(item?.name!, e.target.value as F)}
                                slotProps={{
                                    select: {
                                        native: true,
                                    },
                                }}
                                variant="outlined"
                                style={{ minWidth: 150 }}
                                disabled={false}
                            >
                                {item?.initialData?.map((data) => {
                                    return (
                                        <option key={`${data.value}`} value={String(data.value)}>
                                            {data.label}
                                        </option>
                                    );
                                })}
                            </TextField>
                        ),
                        isEnhanced: item?.isEnhanced ? item?.isEnhanced : false,
                        name: 'SearchByPlace',
                    };
                    updatedElementInputs.push(element);
                    break;
                }
                case TYPE_FILTERS.DATE_RANGE_PICKER: {
                    const element = {
                        ...item,
                        component: (
                            <DateRangePicker
                                key={idx}
                                options={{
                                    hideDefaultRanges: item?.isShowCalendarInfo ?? true,
                                    maxDate: item?.isFutureDate ? moment().toDate() : undefined,
                                }}
                                value={{
                                    startDate: (item?.defaultValue as { startDate: Moment | null })?.startDate?.toDate() ?? new Date(),
                                    endDate: (item?.defaultValue as { endDate: Moment | null })?.endDate?.toDate() ?? new Date(),
                                }}
                                label={`${t('Common.StartDate')} - ${t('Common.EndDate')}`}
                                variant="outlined"
                                textFieldProps={{
                                    fullWidth: true,
                                    className: classes.outlinedInput,
                                }}
                                onChange={handleChangeDateRange}
                                {...(item?.isDayBlocked && {
                                    isDayBlocked: item.isDayBlocked,
                                })}
                            />
                        ),
                        isEnhanced: item?.isEnhanced ? item?.isEnhanced : false,
                        name: 'dateRangePicker',
                    };
                    updatedElementInputs.push(element);
                    break;
                }
                case TYPE_FILTERS.CAMPAIGN: {
                    const CampaignFilter = item?.nodeElement! as React.ComponentType<{
                        defaultValue: number[];
                        disabled: boolean;
                        onSubmit: (campaignIds: number[]) => void;
                        disableMulti?: boolean;
                    }>;

                    const element = {
                        ...item,
                        component: (
                            <CampaignFilter
                                key={idx}
                                defaultValue={[]}
                                disabled={String(queryInput?.isCampaignDefault) === '-1'}
                                onSubmit={(campaignIds: number[]) => handleChangeQueryInput(item?.name!, campaignIds as F)}
                                disableMulti={item?.disableMulti}
                            />
                        ),
                        isEnhanced: item?.isEnhanced ? item?.isEnhanced : false,
                        name: 'campaign',
                    };
                    updatedElementInputs.push(element);
                    break;
                }
                case TYPE_FILTERS.PLACE: {
                    const PlaceFilter = item?.nodeElement! as React.ComponentType<{
                        isDisplayTextField: boolean;
                        onChange: (placeIds: number[]) => void;
                    }>;

                    const element = {
                        ...item,
                        component: (
                            <PlaceFilter
                                key={idx}
                                isDisplayTextField
                                onChange={(placeIds: number[]) => handleChangeQueryInput(item?.name!, placeIds as F)}
                            />
                        ),
                        isEnhanced: item?.isEnhanced ? item?.isEnhanced : false,
                        name: 'place',
                    };
                    updatedElementInputs.push(element);

                    break;
                }
                case TYPE_FILTERS.PLACE_AUTOCOMPLETE: {
                    const PlaceFilter = item?.nodeElement! as React.ComponentType<{
                        onChange: (_event: React.SyntheticEvent, value: { id: number }) => void;
                        disabled: boolean;
                    }>;

                    const element = {
                        ...item,
                        component: (
                            <PlaceFilter
                                key={idx}
                                onChange={(_event: React.SyntheticEvent, value: { id: number }) => {
                                    handleChangeQueryInput(item?.name!, value?.id as F);
                                }}
                                disabled={String(queryInput?.domainId) === '0'}
                            />
                        ),
                        isEnhanced: item?.isEnhanced ? item?.isEnhanced : false,
                        name: 'placeAutoComplete',
                    };
                    updatedElementInputs.push(element);

                    break;
                }
                case TYPE_FILTERS.DOMAIN_AUTOCOMPLETE: {
                    const DomainFilter = item?.nodeElement! as React.ComponentType<{
                        onChange: (_event: React.SyntheticEvent, value: { domainId: number }) => void;
                    }>;

                    const element = {
                        ...item,
                        component: (
                            <DomainFilter
                                key={idx}
                                onChange={(_event: React.SyntheticEvent, value: { domainId: number }) => {
                                    item?.onChange && item?.onChange(value?.domainId as F);
                                    handleChangeQueryInput(item?.name!, value?.domainId as F);
                                }}
                            />
                        ),
                        isEnhanced: item?.isEnhanced ? item?.isEnhanced : false,
                        name: 'placeAutoComplete',
                    };
                    updatedElementInputs.push(element);

                    break;
                }
                case TYPE_FILTERS.NETWORK: {
                    const element = {
                        ...item,
                        component: (
                            <FormControlLabel
                                key={idx}
                                control={<Checkbox color="primary" defaultChecked={Boolean(queryInput?.isCampaignNetwork ?? true)} />}
                                label={t('Statistic.Network.Title')}
                                labelPlacement="start"
                                onChange={(_event: React.SyntheticEvent, value) => {
                                    handleChangeQueryInput(item?.name!, value as F);
                                }}
                            />
                        ),
                        isEnhanced: item?.isEnhanced ? item?.isEnhanced : false,
                        name: 'isCampaignNetwork',
                    };
                    updatedElementInputs.push(element);

                    break;
                }
                case TYPE_FILTERS.CAMPAIGN_DEFAULT: {
                    const element = {
                        ...item,
                        component: (
                            <FormControl key={idx}>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue={queryInput?.isCampaignDefault}
                                    name="radio-buttons-group"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        handleChangeQueryInput(item?.name!, e.target.value as F);
                                    }}
                                >
                                    <FormControlLabel value={'0'} control={<Radio />} label={t('Filter.AllCampaign')} />
                                    <FormControlLabel value={'-1'} control={<Radio />} label={t('Filter.CampaignDefault')} />
                                </RadioGroup>
                            </FormControl>
                        ),
                        isEnhanced: item?.isEnhanced ? item?.isEnhanced : false,
                        name: 'isCampaignDefault',
                    };
                    updatedElementInputs.push(element);

                    break;
                }
                case TYPE_FILTERS.INCLUDE_RESERVED: {
                    const element = {
                        ...item,
                        component: (
                            <FormControlLabel
                                key={idx}
                                control={<Checkbox color="primary" defaultChecked={Boolean(queryInput?.includeReserved) ?? true} />}
                                label={t('StatisticSchedulePlan.IncludeCampaignReserved')}
                                labelPlacement="start"
                                onChange={(_e: React.SyntheticEvent, value) => {
                                    handleChangeQueryInput(item?.name!, value as F);
                                }}
                            />
                        ),
                        isEnhanced: item?.isEnhanced ? item?.isEnhanced : false,
                        name: 'includeReserved',
                    };
                    updatedElementInputs.push(element);
                    break;
                }
                case TYPE_FILTERS.SEARCH_CAMPAIGNS: {
                    const element = {
                        ...item,
                        component: (
                            <Autocomplete
                                fullWidth
                                size="small"
                                id="campaignId"
                                options={item?.initialData!}
                                data-testid="campaignId"
                                onChange={(_event, campaignItem, reason) => {
                                    item?.onChange &&
                                        item.onChange({
                                            campaignId: reason === 'clear' ? 0 : campaignItem?.value,
                                        } as F);
                                }}
                                sx={{ marginRight: (theme) => theme.spacing(2) }}
                                getOptionLabel={(option) => option?.label || ''}
                                value={item?.initialData!.find((x) => x.value === item.value)}
                                renderInput={(params) => <TextField {...params} label={t('CampaignPlan.CampaignName')} />}
                                renderOption={(props, option) => (
                                    <li {...props} key={String(option.value)}>
                                        {option.label || String(option.value)}
                                    </li>
                                )}
                            />
                        ),
                        isEnhanced: item?.isEnhanced ? item?.isEnhanced : false,
                        name: 'searchCampaigns',
                    };
                    updatedElementInputs.push(element);
                    break;
                }
            }
        });
        setElementInputs([...updatedElementInputs]);
    };

    useEffect(() => {
        let tmpQueryInput = queryInput;
        if (!tmpQueryInput) {
            tmpQueryInput = handleInitialFilter(initialFilters);
        }
        onChangeQueryInput(tmpQueryInput!);

        setQueryInput(tmpQueryInput);
    }, []);

    useEffect(() => {
        handleElementInput(initialFilters);
    }, [initialFilters, queryInput]);

    const onShowFilterEnhanced = () => {
        setIsHideFieldAdvanced(!isShowFilterEnhanced);
    };

    return (
        <>
            <Grid container justifyContent="flex-end" spacing={2}>
                {elementInputs
                    .filter((item) => item.isEnhanced === false || item.isEnhanced === undefined)
                    .map((fieldFilterEnhanced, idx: number) => {
                        return (
                            <>
                                <Grid
                                    key={idx}
                                    {...(fieldFilterEnhanced?.type === TYPE_FILTERS.DATE_RANGE_PICKER
                                        ? {
                                              sx: {
                                                  xs: fieldFilterEnhanced?.col ? fieldFilterEnhanced?.col : 3,
                                                  minWidth: '255px',
                                                  '& .MuiInputBase-input': {
                                                      height: '1.25rem',
                                                  },
                                              },
                                          }
                                        : {
                                              sx: {
                                                  xs: fieldFilterEnhanced?.col ? fieldFilterEnhanced?.col : 3,
                                              },
                                          })}
                                >
                                    {fieldFilterEnhanced?.component}
                                </Grid>
                            </>
                        );
                    })}
                <Grid sx={{ paddingTop: '8px !important' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={getView}
                        style={{ height: '40px' }}
                        disabled={
                            isLoadings ||
                            (disableView && Array.isArray(queryInput?.placeIds) && queryInput?.placeIds?.length === 0) ||
                            !!(disableView && queryInput?.domainId && (queryInput?.domainId === 0 || queryInput?.domainId === undefined))
                        }
                    >
                        {t('Common.View')}
                    </Button>
                    {elementInputs.filter((item) => item.isEnhanced === true)?.length > 0 && (
                        <IconButton sx={{ marginLeft: '10px' }} onClick={onShowFilterEnhanced}>
                            {isShowFilterEnhanced ? <ExpandMore /> : <ExpandLess />}
                        </IconButton>
                    )}
                </Grid>
            </Grid>

            {isShowFilterEnhanced && (
                <Grid container justifyContent="flex-end" spacing={2} sx={{ paddingRight: '3rem' }}>
                    {elementInputs
                        .filter((item) => item.isEnhanced === true)
                        .map((fieldFilterEnhanced, idx: number) => {
                            return (
                                <>
                                    <Grid
                                        key={idx}
                                        sx={{
                                            xs: fieldFilterEnhanced?.col ? fieldFilterEnhanced?.col : 3,
                                            ...(fieldFilterEnhanced?.type === TYPE_FILTERS.INCLUDE_RESERVED || TYPE_FILTERS.CAMPAIGN_DEFAULT
                                                ? {
                                                      paddingTop: '1.5rem',
                                                      display: 'flex',
                                                      flex: 'none',
                                                  }
                                                : {}),
                                        }}
                                    >
                                        {fieldFilterEnhanced?.component}
                                    </Grid>
                                </>
                            );
                        })}
                </Grid>
            )}
        </>
    );
};

export default ControlPanels;

export * from './Enums';
export * from './Types';
