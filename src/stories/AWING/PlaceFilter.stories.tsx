import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router';
import { isEqual } from 'lodash';
import { Search as SearchIcon } from '@mui/icons-material';
import { IOption } from 'AWING/MultipleChoice';
import PlaceFilter, { EnumFieldInputType, EnumSelectedPlaceType, IFilterField, ITag } from 'AWING/PlaceFilter';
import GroupData from '../common/data/group-data.json';
import DomainData from '../common/data/domain-data.json';
import ProvinceData from '../common/data/province-data.json';
import MockPlaces from '../common/data/db.json';
import { USE_LOGIC_OPERATOR } from 'Commons/Constant';
import Layout from '../common/Layout';

export type Story = StoryObj<typeof meta>;

// #region Meta
const meta = {
    title: 'AWING/PlaceFilter',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: PlaceFilter,
} satisfies Meta<typeof PlaceFilter>;
// #endregion Meta

const mockDataFilterField: IFilterField[] = [
    {
        label: 'Domain',
        name: 'domain',
        value: [],
        type: EnumFieldInputType.MULTIPLE_SELECT,
        placeHolders: ['Domain'],
        inputParameter: DomainData.map((domain) => ({
            id: domain.domainId,
            name: domain.domainName,
        })),
        isAdvanceField: false,
        style: {
            gridSize: 6,
        },
        endAdornmentOptions: USE_LOGIC_OPERATOR,
        endAdornmentValue: 'or',
    },
    {
        label: 'Area select',
        name: 'province',
        value: [
            [
                {
                    code: '01',
                    parentUnitCode: '',
                    name: 'Thành phố Hà Nội',
                    type: 0,
                },
            ],
            [
                {
                    code: '02',
                    parentUnitCode: '',
                    name: 'Tỉnh Hà Giang',
                    type: 0,
                },
            ],
        ],
        placeHolders: ['Chọn khu vực'],
        type: EnumFieldInputType.MULTIPLE_HIERARCHICAL_CHOICE,
        inputParameter: ProvinceData,
        isAdvanceField: false,
        style: {
            gridSize: 6,
        },
        endAdornmentOptions: USE_LOGIC_OPERATOR,
        endAdornmentValue: 'or',
    },
    {
        label: 'Place group',
        name: 'placeGroup',
        value: '',
        type: EnumFieldInputType.AUTO_COMPLETE,
        inputParameter: GroupData.map((group) => ({
            id: group.groupId,
            name: group.groupName,
        })),
        isAdvanceField: true,
        style: {
            gridSize: 6,
        },
    },
    {
        label: 'Attributes',
        name: 'attributes',
        value: [],
        placeHolders: ['Chọn attribute'],
        type: EnumFieldInputType.MULTIPLE_HIERARCHICAL_CHOICE,
        inputParameter: ProvinceData,
        isAdvanceField: true,
        style: {
            gridSize: 6,
        },
        minLevel: 2,
        parentTitle: 'TỈNH',
        endAdornmentOptions: USE_LOGIC_OPERATOR,
        endAdornmentValue: 'or',
    },
    {
        label: 'Search',
        name: 'searchString',
        value: '',
        placeHolders: ['Nhập từ khóa tìm kiếm'],
        type: EnumFieldInputType.TEXT,
        isAdvanceField: true,
        style: {
            gridSize: 12,
            icon: <SearchIcon />,
        },
    },
    {
        label: 'GeoFencing',
        name: 'geo-fencing',
        value: undefined,
        type: EnumFieldInputType.GEO_FENCING,
        isAdvanceField: true,
        style: {
            gridSize: 12,
        },
        // GOONG_API_KEY: 'JUkTlUZ11wZmX6jSPoLPtEsG8VuPbMddMcihKNoe',
        // GOONG_MAP_KEY: 'hSwoA8SR8o0yMkP7ucnADcx3xY8OD4MnxZTMrCfo',
        GOOGLE_MAP_KEY: 'your_google_map_key_here',
    },
];

const getPlacesByFilter = (filterFields: any[], pageIndex?: number, pageSize?: number) => {
    return new Promise((resolve, reject) => {
        let searchString = '';
        let placeGroupId = '';
        let domains: IOption[] = [];
        let domainOperator: any = undefined;
        let province: any[] = [];
        filterFields?.map((fieldItem) => {
            if (
                fieldItem.value !== undefined &&
                fieldItem.value !== '' &&
                fieldItem.value !== null &&
                !isEqual(fieldItem.value, []) &&
                fieldItem.value !== '-1'
            ) {
                switch (fieldItem.name) {
                    case 'searchString':
                        searchString = fieldItem.value;
                        break;
                    case 'placeGroup':
                        placeGroupId = fieldItem.value;
                        break;
                    case 'domain':
                        domains = fieldItem.value;
                        domainOperator = fieldItem.endAdornmentValue;
                        break;
                    case 'province':
                        province = fieldItem.value;
                        break;
                    default:
                        break;
                }
            }
            return fieldItem;
        });
        let result = MockPlaces.places;
        if (searchString) {
            result = result.filter((r) => r.name.toLowerCase().includes(searchString.toLowerCase()));
        }
        if (placeGroupId) {
            result = result.filter((r) => r.groupId === placeGroupId);
        }
        if (domains.length > 0) {
            result = result.filter((r) => {
                if (domainOperator === 'and') {
                    return !domains.find((d) => d.id !== r.domainId);
                } else {
                    return domains.map((d) => d.id).includes(r.domainId);
                }
            });
        }
        if (province && province.length > 0) {
            // Filter by province
        }
        if (pageIndex === undefined || pageSize === undefined) {
            resolve({
                places: result,
                total: result.length,
            });
        } else {
            resolve({
                places: result.slice(pageSize * pageIndex, pageSize * pageIndex + pageSize),
                total: result.length,
            });
        }
    });
};

const getPlacesByIds = (placeIds: string[]) => {
    return new Promise((resolve, reject) => {
        let result = MockPlaces.places;
        result = result.filter((r) => {
            return placeIds.includes(r.id);
        });
        resolve(result);
    });
};

const callbackFunction = (selectedPlaceIds: string[], filterPlaceIds: string[], tags: ITag[]) => {
    console.log({ tagsAll: { selectedPlaceIds, filterPlaceIds, tags } });
};

export const Simple: Story = {
    args: {
        filterFields: mockDataFilterField,
        getPlacesByFilter: getPlacesByFilter as any,
        getPlacesByIds: getPlacesByIds as any,
        callbackFunction,
        tags: [
            {
                filterFields: mockDataFilterField,
                selectedPlaceIds: ['1'],
                filterPlaceIds: [],
                selectedType: EnumSelectedPlaceType.IDS,
            },
        ],
    },
    render: (args) => {
        return (
            <Layout>
                <BrowserRouter>
                    <PlaceFilter {...args} />
                </BrowserRouter>
            </Layout>
        );
    },
};

export default meta;
