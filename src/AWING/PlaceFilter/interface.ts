import { EnumSelectedPlaceType, EnumFieldInputType } from './Enum';
import { IMultipleHierarchicalChoiceInput, IOption } from '../../AWING';
import { USE_LOGIC_OPERATOR } from 'Commons/Constant';
import { GeoFencingValue } from 'AWING/GeoFencing';

export interface ITagAll {
    tags?: ITag[];
    selectedPlaceIds?: string[];
    filterPlaceIds?: string[];
}

export interface ITag {
    filterFields?: IFilterField[];
    selectedType?: `${EnumSelectedPlaceType}`;
    selectedPlaceIds?: string[];
    filterPlaceIds?: string[];
    isTagPrepare?: boolean;
}

export interface IFilterFieldBase {
    label: string;
    name: string;
    placeHolders?: string[];
    isAdvanceField: boolean;
    style: {
        gridSize: number;
        icon?: React.ReactElement;
    };
}

export interface IText extends IFilterFieldBase {
    type: EnumFieldInputType.TEXT;
    value: string;
}

export interface IAreaSelect extends IFilterFieldBase {
    type: EnumFieldInputType.SELECT_AREA;
    inputParameter: IMultipleHierarchicalChoiceInput[];
    value: IMultipleHierarchicalChoiceInput[];
}

export interface ISelect extends IFilterFieldBase {
    type: EnumFieldInputType.SELECT;
    inputParameter: IOption[];
    value: string;
}

export interface IMultipleHierarchicalChoice extends IFilterFieldBase {
    type: EnumFieldInputType.MULTIPLE_HIERARCHICAL_CHOICE;
    inputParameter: IMultipleHierarchicalChoiceInput[];
    value: IMultipleHierarchicalChoiceInput[][];
    endAdornmentOptions?: typeof USE_LOGIC_OPERATOR | IOption[];
    endAdornmentValue?: string;
    minLevel?: number;
    parentTitle?: string;
}

export interface IGeoFencing extends IFilterFieldBase {
    type: EnumFieldInputType.GEO_FENCING;
    value: GeoFencingValue | undefined;
    GOOGLE_MAP_KEY: string;
    radiusLimit?: { min?: number; max?: number };
}

export interface IAutoComplete extends IFilterFieldBase {
    type: EnumFieldInputType.AUTO_COMPLETE;
    inputParameter: IOption[];
    value: string;
}

export interface IMultipleSelect extends IFilterFieldBase {
    type: EnumFieldInputType.MULTIPLE_SELECT;
    inputParameter: IOption[];
    value: IOption[];
    endAdornmentOptions?: typeof USE_LOGIC_OPERATOR | IOption[];
    endAdornmentValue?: string;
}

export type IFilterField = IText | IAreaSelect | ISelect | IMultipleHierarchicalChoice | IGeoFencing | IAutoComplete | IMultipleSelect;

interface IFilterFieldInputProps<T extends IFilterField> {
    filterField: T;
    index: number;
    onChange: IFilterChange<T>;
}
export type IFilterChange<T extends IFilterField = IFilterField> = (
    newValue: T['value'] | string,
    index: number,
    isChangeOperator?: boolean
) => void;
export type IInputProps<T extends EnumFieldInputType> = IFilterFieldInputProps<Extract<IFilterField, { type: T }>>;

export interface IPages {
    pageIndex: number;
    pageSize: number;
    total: number;
    onPageIndexChange?(pageIndex: number): void;
    onPageSizeChange?(pageIndex: number): void;
}

export interface IPlaceQuery {
    /**
     * Khi không truyền pageIndex pageSize thì là query không có paging
     */
    getPlacesByFilter: (
        filterFields: IFilterField[],
        pageIndex?: number,
        pageSize?: number
    ) => Promise<{ places: IPlace[]; total: number }>;
    getPlacesByIds: (placeIds: string[]) => Promise<IPlace[]>;
}

export interface PlaceFilterProps extends IPlaceQuery {
    //Thông tin, cấu hình, style các input filter
    filterFields: IFilterField[];
    callbackFunction: (selectedPlaceIds: string[], filterPlaceIds: string[], tags: ITag[]) => void;
    tags?: ITag[];
}
export enum PlaceStatus {
    Active = 'ACTIVE',
    InActive = 'IN_ACTIVE',
    Maintenance = 'MAINTENANCE',
    OnPause = 'ON_PAUSE',
}
export type IPlace = {
    __typename?: 'Place';
    address?: string;
    communeCode?: string;
    description?: string;
    districtCode?: string;
    id: number;
    isJoinNetwork: boolean;
    latitude?: number;
    longitude?: number;
    name?: string;
    placeSelectionParameter?: string;
    provinceCode?: string;
    status: PlaceStatus;
    workspaceId: number;
};
