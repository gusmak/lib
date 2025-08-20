import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/material';
import { SearchBox, AdvancedSearch } from 'AWING';
import type { OwnProps, AdvancedValue } from './types';

function Container(props: OwnProps) {
    const { t } = useTranslation();
    const { searchValue, objectTypeCodes, onSearch } = props;

    const [openAdvancedSearch, setOpenAdvancedSearch] = useState<boolean>(false);

    const handleSearch = (searchKey?: string, advancedObject?: AdvancedValue) => {
        const advancedObjectValue = advancedObject?.objectTypeCode;


        onSearch &&
            onSearch({
                searchKey: searchKey ?? '',
                advancedObject: advancedObjectValue?.value
                    ? {
                          objectTypeCode: advancedObjectValue,
                      }
                    : undefined,
            });
    };

    return (
        <Stack gap={1} style={{ marginBottom: 16 }}>
            <SearchBox
                defaultValue={searchValue?.searchKey ?? ''}
                onSearch={(_searchType, newValue) => handleSearch(newValue, searchValue?.advancedObject)}
                onClickAdvancedSearch={() => setOpenAdvancedSearch(!openAdvancedSearch)}
                stylePaper={{ maxWidth: 'inherit' }}
            />
            {openAdvancedSearch && objectTypeCodes?.length && (
                <AdvancedSearch
                    value={searchValue?.advancedObject}
                    rootStyle={{ marginBottom: 0 }}
                    expanded
                    fields={[
                        {
                            fieldName: 'objectTypeCode',
                            label: `${t('ObjectTypeCode.Label')}`,
                            type: 'autocomplete',
                            options: objectTypeCodes.map((o) => ({
                                value: o.key,
                                text: o?.label ?? o?.key,
                            })),
                        },
                    ]}
                    onChangeValue={(obj) => handleSearch(searchValue?.searchKey, obj as AdvancedValue)}
                    onClear={() => handleSearch(searchValue?.searchKey)}
                />
            )}
        </Stack>
    );
}

export default Container;
