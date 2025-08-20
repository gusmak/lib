import { Typography } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { NEGATIVE_COLOR, NORMAL_COLOR, POSITIVE_COLOR } from 'Commons/Constant';
import { EnumFieldInputType } from 'AWING/PlaceFilter/Enum';
import { ITag } from 'AWING/PlaceFilter/interface';
import { createElement as _c } from 'react';
import { getTagInputDetail, getTagTitle } from './utils';
const mockFilterField = [
    {
        label: 'Từ khóa',
        name: 'searchString',
        value: '12312 Nhập từ khóa tìm kiếm Nhập từ khóa tìm kiếm',
        placeHolders: ['Nhập từ khóa tìm kiếm'],
        type: EnumFieldInputType.TEXT,
        isAdvanceField: false,
        style: {
            gridSize: 12,
        },
    },
    {
        type: 'không xác định',
        label: 'Nhóm địa điểm',
        name: 'placeGroup',
        isAdvanceField: false,
        value: '1',
        style: {
            gridSize: 6,
        },
    } as any,
    {
        label: 'Nhóm địa điểm',
        name: 'placeGroup',
        value: '1',
        type: EnumFieldInputType.SELECT,
        inputParameter: [
            {
                name: 'Nhóm địa điểm',
                id: '1',
            },
        ],
        isAdvanceField: false,
        style: {
            gridSize: 6,
        },
    },
    {
        label: 'Nhóm địa điểm',
        name: 'placeGroup',
        value: '1',
        type: EnumFieldInputType.AUTO_COMPLETE,
        inputParameter: [
            {
                name: 'Nhóm địa điểm',
                id: '1',
            },
        ],
        isAdvanceField: true,
        style: {
            gridSize: 6,
        },
    },
    {
        label: 'Khu vực',
        name: 'province',
        value: [
            { code: '1', name: 'Area 1', parentUnitCode: '0' },
            { code: '2', name: 'Area 2', parentUnitCode: '0' },
            { code: '3', name: 'Area 3', parentUnitCode: '1' },
        ],
        type: EnumFieldInputType.SELECT_AREA,
        inputParameter: [
            { code: '1', name: 'Area 1', parentUnitCode: '0' },
            { code: '2', name: 'Area 2', parentUnitCode: '0' },
            { code: '3', name: 'Area 3', parentUnitCode: '1' },
        ],
        isAdvanceField: false,
        style: {
            gridSize: 6,
        },
    },
    {
        label: 'Khu vực',
        name: 'province',
        value: [[{ code: '1', name: 'Area 1', parentUnitCode: '0' }]],
        type: EnumFieldInputType.MULTIPLE_HIERARCHICAL_CHOICE,
        inputParameter: [{ code: '1', name: 'Area 1', parentUnitCode: '0' }],
        isAdvanceField: false,
        style: {
            gridSize: 6,
        },
    },
    {
        label: 'Khu vực',
        name: 'geoFencing',
        type: EnumFieldInputType.GEO_FENCING,
        isAdvanceField: false,
        value: {
            latitude: 21.028511,
            longitude: 105.804817,
            radius: 1000,
        },
        style: {
            gridSize: 6,
        },
        GOONG_MAP_KEY: 'string',
        GOONG_API_KEY: 'string',
        GOOGLE_MAP_KEY: 'string',
    },
    {
        label: 'Nhóm địa điểm',
        name: 'placeGroup',
        value: [{ name: 'Nhóm địa điểm', id: '1' }],
        type: EnumFieldInputType.MULTIPLE_SELECT,
        inputParameter: [
            {
                name: 'Nhóm địa điểm',
                id: '1',
            },
        ],
        isAdvanceField: true,
        style: {
            gridSize: 6,
        },
        endAdornmentValue: 'string',
    },
];
describe('utils.ts tests', () => {
    describe('getTagInputDetail', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('should return tag input details', () => {
            const tag: ITag = {
                filterFields: [
                    {
                        value: 'test',
                        type: EnumFieldInputType.TEXT,
                        label: 'Test',
                        name: 'testName',
                        isAdvanceField: false,
                        style: {
                            gridSize: 12,
                        },
                    },
                ],
            };
            const details = getTagInputDetail(tag);
            expect(details).toEqual([
                _c(
                    Typography,
                    {
                        key: 0,
                        variant: 'subtitle2',
                        style: { fontWeight: 'bold' },
                    },
                    'Test: test'
                ),
            ]);
        });

        it('should return empty array when no filter fields', () => {
            const tag: ITag = { filterFields: [] };
            const details = getTagInputDetail(tag);
            expect(details).toEqual([]);
        });
        it('orther EnumFieldInputType', () => {
            const tag: ITag = { filterFields: mockFilterField };
            const { container } = render(getTagInputDetail(tag));
            const el = container.querySelectorAll('[style="font-weight: bold;"]');
            expect(el).toHaveLength(11);
        });
    });

    describe('getTagTitle', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('should return tag title with normal color', () => {
            const tag: ITag = {
                filterFields: [
                    {
                        value: 'test',
                        type: EnumFieldInputType.TEXT,
                        label: 'Test',
                        name: 'testName',
                        isAdvanceField: false,
                        style: { gridSize: 12 },
                    },
                ],
                filterPlaceIds: ['1', '2', '3'],
            };
            render(getTagTitle(tag, 3));
            const el = screen.getByText('3');
            expect(el).toBeInTheDocument();
            expect(el).toHaveStyle({ color: NORMAL_COLOR });
        });

        it('should return tag title with positive color', () => {
            const tag: ITag = {
                filterFields: [
                    {
                        value: 'test',
                        type: EnumFieldInputType.TEXT,
                        label: 'Test',
                        name: 'testName',
                        isAdvanceField: false,
                        style: { gridSize: 12 },
                    },
                ],
                filterPlaceIds: ['1', '2', '3', '4'],
            };
            render(getTagTitle(tag, 3));
            const el = screen.getByText('4 (+1)');
            expect(el).toBeInTheDocument();
            expect(el).toHaveStyle({ color: POSITIVE_COLOR });
        });

        it('should return tag title with negative color', () => {
            const tag: ITag = {
                filterFields: [
                    {
                        value: 'test',
                        type: EnumFieldInputType.TEXT,
                        label: 'Test',
                        name: 'testName',
                        isAdvanceField: false,
                        style: { gridSize: 12 },
                    },
                ],
                filterPlaceIds: ['1', '2'],
            };
            render(getTagTitle(tag, 3));
            const el = screen.getByText('2 (-1)');
            expect(el).toBeInTheDocument();
            expect(el).toHaveStyle({ color: NEGATIVE_COLOR });
        });

        it('should return "ALL" when title is empty', () => {
            const tag: ITag = { filterFields: [] };
            render(getTagTitle(tag, 0));
            const el = screen.getByText('0');
            expect(el).toBeInTheDocument();
            expect(el).toHaveStyle({ color: NORMAL_COLOR });
        });
        it('orther EnumFieldInputType', () => {
            const tag: ITag = { filterFields: mockFilterField };
            render(getTagTitle(tag, 0));
            const el = screen.getByText('0');
            expect(el).toBeInTheDocument();
            expect(el).toHaveStyle({ color: NORMAL_COLOR });
        });
        it(' EnumFieldInputType.SELECT_AREA', () => {
            const tag: ITag = {
                filterFields: [
                    {
                        label: 'Khu vực',
                        name: 'province',
                        value: [
                            { code: '1', name: 'Area 1', parentUnitCode: '0' },
                            { code: '2', name: 'Area 2', parentUnitCode: '0' },
                            { code: '3', name: 'Area 3', parentUnitCode: '1' },
                        ],
                        type: EnumFieldInputType.SELECT_AREA,
                        inputParameter: [
                            { code: '1', name: 'Area 1', parentUnitCode: '0' },
                            { code: '2', name: 'Area 2', parentUnitCode: '0' },
                            { code: '3', name: 'Area 3', parentUnitCode: '1' },
                        ],
                        isAdvanceField: false,
                        style: {
                            gridSize: 6,
                        },
                    },
                ],
            };
            render(getTagTitle(tag, 0));
            const el = screen.getByText('0');
            expect(el).toBeInTheDocument();
            expect(el).toHaveStyle({ color: NORMAL_COLOR });
        });
        it(' EnumFieldInputType.MULTIPLE_HIERARCHICAL_CHOICE', () => {
            const tag: ITag = {
                filterFields: [
                    {
                        label: 'Khu vực',
                        name: 'province',
                        value: [[{ code: '1', name: 'Area 1', parentUnitCode: '0' }]],
                        type: EnumFieldInputType.MULTIPLE_HIERARCHICAL_CHOICE,
                        inputParameter: [{ code: '1', name: 'Area 1', parentUnitCode: '0' }],
                        isAdvanceField: false,
                        style: {
                            gridSize: 6,
                        },
                    },
                ],
            };
            render(getTagTitle(tag, 0));
            const el = screen.getByText('0');
            expect(el).toBeInTheDocument();
            expect(el).toHaveStyle({ color: NORMAL_COLOR });
        });
        it(' EnumFieldInputType.GEO_FENCING', () => {
            const tag: ITag = {
                filterFields: [
                    {
                        label: 'Khu vực',
                        name: 'geoFencing',
                        type: EnumFieldInputType.GEO_FENCING,
                        isAdvanceField: false,
                        value: {
                            latitude: 21.028511,
                            longitude: 105.804817,
                            radius: 1000,
                        },
                        style: {
                            gridSize: 6,
                        },
                        GOOGLE_MAP_KEY: 'string',
                    },
                ],
            };
            render(getTagTitle(tag, 0));
            const el = screen.getByText('0');
            expect(el).toBeInTheDocument();
            expect(el).toHaveStyle({ color: NORMAL_COLOR });
        });
        it(' EnumFieldInputType.AUTO_COMPLETE', () => {
            const tag: ITag = {
                filterFields: [
                    {
                        label: 'Nhóm địa điểm',
                        name: 'placeGroup',
                        value: '1',
                        type: EnumFieldInputType.AUTO_COMPLETE,
                        inputParameter: [
                            {
                                name: 'Nhóm địa điểm',
                                id: '1',
                            },
                        ],
                        isAdvanceField: true,
                        style: {
                            gridSize: 6,
                        },
                    },
                ],
            };
            render(getTagTitle(tag, 0));
            const el = screen.getByText('0');
            expect(el).toBeInTheDocument();
            expect(el).toHaveStyle({ color: NORMAL_COLOR });
        });
        it(' EnumFieldInputType.MULTIPLE_SELECT', () => {
            const tag: ITag = {
                filterFields: [
                    {
                        label: 'Nhóm địa điểm',
                        name: 'placeGroup',
                        value: [{ name: 'Nhóm địa điểm', id: '1' }],
                        type: EnumFieldInputType.MULTIPLE_SELECT,
                        inputParameter: [
                            {
                                name: 'Nhóm địa điểm',
                                id: '1',
                            },
                        ],
                        isAdvanceField: true,
                        style: {
                            gridSize: 6,
                        },
                    },
                ],
            };
            render(getTagTitle(tag, 0));
            const el = screen.getByText('0');
            expect(el).toBeInTheDocument();
            expect(el).toHaveStyle({ color: NORMAL_COLOR });
        });
    });
});
