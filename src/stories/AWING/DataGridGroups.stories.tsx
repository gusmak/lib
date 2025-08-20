import { Meta, StoryObj } from '@storybook/react';
import _ from 'lodash';
import DataGridGroups from 'AWING/DataGridGroups';
import Layout from '../common/Layout';
export enum DataGridSortType {
    Asc = 'ASC',
    Desc = 'DESC',
    Ready = 'READY',
}

export type Story = StoryObj<typeof meta>;

const ContainerDemo = () => {
    const initCell = [
        {
            fieldName: 'campaign',
            label: 'Campaign',
            colWidth: '200px',
            draggable: true,
        },
        {
            fieldName: 'place',
            label: 'Place',
            colWidth: '200px',
            draggable: true,
        },
        {
            fieldName: 'date',
            label: 'Date',
            colWidth: '200px',
            draggable: true,
        },
    ];

    const handleFilter = (
        page: { pageIndex: number; pageSize: number },
        fieldName?: string | undefined,
        rootFilters?: { key: string; value: React.ReactNode }[]
    ) => {
        if (!fieldName && !rootFilters) {
            return Promise.resolve({
                items: [
                    {
                        campaign: 'Campaign Demo 01',
                        place: 'Place Demo 01',
                        date: '12/03/2025',
                    },
                    {
                        campaign: 'Campaign Demo 02',
                        place: 'Place Demo 02',
                        date: '12/01/2025',
                    },
                    {
                        campaign: 'Campaign Demo 033',
                        place: 'Place Demo 03',
                        date: '12/03/2025',
                    },
                ],
                totalCount: 3,
            });
        }

        if (fieldName && !rootFilters) {
            if (fieldName === 'place') {
                return Promise.resolve({
                    items: [
                        {
                            campaign: '3',
                            place: 'Place Demo 01',
                            date: '12/03/2025',
                            groupKeyId: '5504693026866563256',
                        },
                        {
                            campaign: '2',
                            place: 'Place Demo 02',
                            date: '12/01/2025',
                            groupKeyId: '5504693026866563256',
                        },
                    ],
                    totalCount: 2,
                });
            }
            if (fieldName === 'campaign') {
                return Promise.resolve({
                    items: [
                        {
                            campaign: 'Campaign Demo 01',
                            place: '2',
                            date: '12/03/2025',
                            groupKeyId: '5504693026866563256',
                        },
                    ],
                    totalCount: 1,
                });
            }

            if (fieldName === 'date') {
                return Promise.resolve({
                    items: [
                        {
                            campaign: '2',
                            place: '3',
                            date: '12/03/2025',
                            groupKeyId: '5504693026866563256',
                        },
                        {
                            campaign: '2',
                            place: '2',
                            date: '12/01/2025',
                            groupKeyId: '5504693026866563256',
                        },
                    ],
                    totalCount: 2,
                });
            }
        }

        if (rootFilters?.length) {
            if (fieldName) {
                if (fieldName === 'place' && rootFilters.find((o) => o.key === 'campaign')) {
                    return Promise.resolve({
                        items: [
                            {
                                place: 'Place Demo 01',
                                date: '12/03/2025',
                                groupKeyId: '5504693026866563256',
                            },
                            {
                                place: 'Place Demo 02',
                                date: '12/01/2025',
                                groupKeyId: '5504693026866563256',
                            },
                        ],
                        totalCount: 2,
                    });
                }

                if (fieldName === 'campaign' && rootFilters.find((o) => o.key === 'place')) {
                    return Promise.resolve({
                        items: [
                            {
                                campaign: 'Campaign Demo 01',
                                date: '12/03/2025',
                                groupKeyId: '5504693026866563256',
                            },
                        ],
                        totalCount: 1,
                    });
                }

                if (fieldName === 'date' && rootFilters.find((o) => o.key === 'place')) {
                    return Promise.resolve({
                        items: [
                            {
                                date: '12/03/2025',
                                campaign: 'Campaign Demo 01',
                                groupKeyId: '5504693026866563256',
                            },
                            {
                                date: '12/01/2025',
                                campaign: 'Campaign Demo 02',
                                groupKeyId: '5504693026866563256',
                            },
                        ],
                        totalCount: 2,
                    });
                }
            } else {
                if (rootFilters.find((o) => o.key === 'date')) {
                    return Promise.resolve({
                        items: [
                            {
                                campaign: 'Campaign Demo 01',
                                place: 'Place Demo 01',
                            },
                            {
                                campaign: 'Campaign Demo 02',
                                place: 'Place Demo 02',
                            },
                        ],
                        totalCount: 2,
                    });
                }
                if (rootFilters.find((o) => o.key === 'place')) {
                    return Promise.resolve({
                        items: [
                            {
                                campaign: 'Campaign Demo 01',
                                date: '12/03/2025 - 02/04/2025',
                            },
                            {
                                campaign: 'Campaign Demo 02',
                                date: '12/03/2025',
                            },
                        ],
                        totalCount: 2,
                    });
                }
                if (rootFilters.find((o) => o.key === 'campaign')) {
                    return Promise.resolve({
                        items: [
                            {
                                campaign: 'Place Demo 01',
                                date: '12/03/2025 - 04/04/2025',
                            },
                            {
                                campaign: 'Place Demo 02',
                                date: '12/03/2025',
                            },
                        ],
                        totalCount: 2,
                    });
                }
            }
        }

        return Promise.resolve({
            items: [],
            totalCount: 0,
        });
    };

    return (
        <Layout
            style={{
                minWidth: '700px',
            }}
        >
            <DataGridGroups
                cells={[
                    {
                        fieldName: 'campaign',
                        label: 'Campaign',
                        colWidth: '200px',
                        draggable: true,
                        onSort: (fieldName, sortType) => {
                            console.log(fieldName, sortType);
                        },
                    },
                    {
                        fieldName: 'place',
                        label: 'Place',
                        colWidth: '200px',
                        draggable: true,
                        onSort: (fieldName, sortType) => {
                            console.log(fieldName, sortType);
                        },
                        align: 'center',
                    },
                    {
                        fieldName: 'date',
                        label: 'Date',
                        colWidth: '200px',
                        draggable: true,
                    },
                ]}
                // defaultGroups={['campaign', 'place']}
                onRowClick={(row) => {
                    console.log(row);
                }}
                onFilter={handleFilter}
            />
        </Layout>
    );
};

// #region Meta
const meta = {
    title: 'AWING/DataGridGroups',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: ContainerDemo,
} satisfies Meta<typeof ContainerDemo>;
// #endregion Meta

export const Simple: Story = {
    args: {},
    render: (args) => {
        return <ContainerDemo />;
    },
};

export default meta;
