import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import ConfigFilter from '../ConfigFilter';
import { IConfigFilter, ObjectFilter } from '../type';
import { MemoryRouter } from 'react-router';

describe('ConfigFilter Component', () => {
    const { t } = useTranslation();

    const onChangeAddFilterMock = jest.fn();

    const mockData: IConfigFilter = {
        loading: false,
        notificationConfigDetailPermissions: true,
        objectFilters: [
            {
                id: 2,
                name: 'test 002',
                objectType: 'MEDIA_PLAN',
                logicalExpression: 'o.name = "name"',
                configType: 'OBJECT_AND_CHANGED',
            },
            {
                id: 3,
                name: 'test 003',
                objectType: 'MEDIA_PLAN',
                logicalExpression: 'o.name = "abc"',
                configType: 'OBJECT_AND_CHANGED',
            },
            {
                id: 4,
                name: 'test01',
                objectType: 'MEDIA_PLAN',
                logicalExpression: 'testabcc',
                configType: 'OBJECT_AND_CHANGED',
            },
            {
                id: 5,
                name: 'test 02123345',
                objectType: 'RECONCILIATION_PERIOD',
                logicalExpression: '14234345345',
                configType: 'OBJECT_AND_CHANGED',
            },
        ] as ObjectFilter[],
        users: [
            {
                id: '1523',
                name: 'Lê Thế Phong',
                username: 'phonglt@awing.vn',
                description: undefined,
                gender: 1,
                image: undefined,
            },
            {
                id: '1559',
                name: 'Phạm Quang Huy',
                username: 'huypq@awing.vn',
                description: 'Quản lý chung về campaign',
                gender: 1,
                image: undefined,
            },
            {
                id: '4663729242554296404',
                name: 'Nguyễn Ngọc Linh',
                username: 'linhnn@awing.vn',
                description: undefined,
                gender: 1,
                image: undefined,
            },
        ],
        groups: [],
        templates: [],
        onChangeAddFilter: onChangeAddFilterMock,
        notificationConfigDetails: [
            {
                objectFilterId: 2,
                channels: [
                    {
                        channelType: 'EMAIL',
                        lastPoints: [
                            {
                                id: '1',
                                type: 'EMAIL',
                                email: 'linhnn@awing.vn',
                                templateId: '1',
                            },
                        ],
                    },
                ],
            },
        ],
    };

    it('renders ConfigFilter component', () => {
        render(
            <MemoryRouter>
                <ConfigFilter {...mockData} />
            </MemoryRouter>
        );
        // You can add more specific assertions based on your component's structure
        expect(screen.getByText(t('NotificationConfig.ConfigFilter'))).toBeInTheDocument();

        expect(screen.getByText('Common.Save')).toBeInTheDocument();
    });

    it.skip('should action submit button form', async () => {
        render(
            <MemoryRouter>
                <ConfigFilter {...mockData} />
            </MemoryRouter>
        );

        const filterNameInput = screen.getByLabelText('NotificationConfig.Filter');
        expect(filterNameInput).toBeInTheDocument();

        // You can add more specific assertions based on your component's structure
        const submitButton = screen.getByText('Common.Save');
        await fireEvent.click(submitButton);

        // The "onChangeAddFilter" prop should have been called with the current filter
        expect(onChangeAddFilterMock).toHaveBeenCalled();
    });
    it('should action close button form', async () => {
        render(
            <MemoryRouter>
                <ConfigFilter {...mockData} />
            </MemoryRouter>
        );

        const closeButton = screen.getByLabelText('Common.Close');
        await fireEvent.click(closeButton);
    });

    it('renders ConfigFilter component with loading is true', () => {
        // const mockDataConfigFilter: IConfigFilter = {}

        render(
            <MemoryRouter>
                <ConfigFilter {...mockData} loading={true} />
            </MemoryRouter>
        );
        // You can add more specific assertions based on your component's structure
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('handles filter selection and navigation', () => {
        render(
            <MemoryRouter>
                <ConfigFilter {...mockData} />
            </MemoryRouter>
        );
        expect(screen.getByText('NotificationConfig.FilterObject.SelectFilter')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('combobox'));

        fireEvent.click(screen.getByText('Common.Continue'));

        expect(screen.getByText('NotificationConfig.FilterObject.SelectNotificationChannel')).toBeInTheDocument();
    });

    it('moves from step 0 to step 1 when clicking the "Common.Continue" button', () => {
        // Provide mockData with a non-zero default filterObjectId

        render(
            <MemoryRouter>
                <ConfigFilter {...mockData} />
            </MemoryRouter>
        );

        // Confirm we're initially at step 0
        expect(screen.getByText('NotificationConfig.FilterObject.SelectFilter')).toBeInTheDocument();

        // Click "Common.Continue" triggers handleNext
        fireEvent.click(screen.getByText('Common.Continue'));

        // Confirm we've moved to step 1
        expect(screen.getByText('NotificationConfig.FilterObject.SelectNotificationChannel')).toBeInTheDocument();
    });

    it('calls handleChangeFilter when a filter is selected', () => {
        const mockDataTest: IConfigFilter = {
            loading: false,
            notificationConfigDetailPermissions: true,
            objectFilters: [
                {
                    id: 2,
                    name: 'test 002',
                    objectType: 'MEDIA_PLAN',
                    logicalExpression: 'o.name = "name"',
                    configType: 'OBJECT_AND_CHANGED',
                },
                {
                    id: 3,
                    name: 'test 003',
                    objectType: 'MEDIA_PLAN',
                    logicalExpression: 'o.name = "abc"',
                    configType: 'OBJECT_AND_CHANGED',
                },
            ] as ObjectFilter[],
            users: [
                {
                    id: '1523',
                    name: 'Lê Thế Phong',
                    username: 'phonglt@awing.vn',
                    description: undefined,
                    gender: 1,
                    image: undefined,
                },
                {
                    id: '1559',
                    name: 'Phạm Quang Huy',
                    username: 'huypq@awing.vn',
                    description: 'Quản lý chung về campaign',
                    gender: 1,
                    image: undefined,
                },
                {
                    id: '4663729242554296404',
                    name: 'Nguyễn Ngọc Linh',
                    username: 'linhnn@awing.vn',
                    description: undefined,
                    gender: 1,
                    image: undefined,
                },
            ],
            groups: [],
            templates: [],
            onChangeAddFilter: onChangeAddFilterMock,
            notificationConfigDetails: [
                {
                    objectFilterId: 2,
                    channels: [
                        {
                            channelType: 'EMAIL',
                            lastPoints: [
                                {
                                    id: '1',
                                    type: 'EMAIL',
                                    email: 'linhnn@awing.vn',
                                    templateId: '1',
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        render(
            <MemoryRouter>
                <ConfigFilter {...mockDataTest} />
            </MemoryRouter>
        );

        screen.debug();
        const selectElement = screen.getByTestId('filter') as HTMLSelectElement;
        fireEvent.click(selectElement);

        expect(selectElement.value).toBe(undefined);
    });

    it('calls handleChangeFilter when a filter is selected', () => {
        render(
            <MemoryRouter>
                <ConfigFilter {...mockData} />
            </MemoryRouter>
        );

        const selectElement = screen.getByTestId('filter');
        fireEvent.change(selectElement, { target: { value: '3' } });

        expect(selectElement).toHaveValue('3');
    });

    it('calls handleChangeFilter with the correct value', () => {
        render(
            <MemoryRouter>
                <ConfigFilter {...mockData} />
            </MemoryRouter>
        );

        const selectElement = screen.getByTestId('channel');
        fireEvent.change(selectElement, { target: { value: '3' } });

        expect(selectElement).toHaveValue('3');
    });

    it('disables the continue button if no filter is selected', () => {
        render(
            <MemoryRouter>
                <ConfigFilter {...mockData} />
            </MemoryRouter>
        );

        const continueButton = screen.getByText('Common.Continue');
        expect(continueButton).toBeDisabled();
    });

    it('enables the continue button if a channel is selected', () => {
        render(
            <MemoryRouter>
                <ConfigFilter {...mockData} />
            </MemoryRouter>
        );

        const selectElement = screen.getByTestId('channel');
        fireEvent.change(selectElement, { target: { value: '3' } });

        const continueButton = screen.getByText('Common.Continue');
        expect(continueButton).not.toBeDisabled();
    });
    // it('calls handleChangeFilter with the correct value', () => {
    //     render(
    //         <MemoryRouter>
    //             <ConfigFilter {...mockData} />
    //         </MemoryRouter>
    //     );

    //     const selectElement = screen.getByTestId('filter');
    //     fireEvent.change(selectElement, { target: { value: '3' } });

    //     expect(selectElement.value).toBe('3');
    // });

    it('disables the "Common.Continue" button when filter.objectFilterId is not set', () => {
        render(
            <MemoryRouter>
                <ConfigFilter {...mockData} />
            </MemoryRouter>
        );

        const continueButton = screen.getByTestId('next');
        expect(continueButton).toBeDisabled();
    });

    it('enables the "Common.Continue" button when filter.objectFilterId is set', () => {
        const updatedMockData = {
            ...mockData,
            notificationConfigDetails: [
                {
                    objectFilterId: 3,
                    channels: [
                        {
                            channelType: 'EMAIL',
                            lastPoints: [
                                {
                                    id: '1',
                                    type: 'EMAIL',
                                    email: 'linhnn@awing.vn',
                                    templateId: '1',
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        render(
            <MemoryRouter>
                <ConfigFilter {...updatedMockData} />
            </MemoryRouter>
        );

        const continueButton = screen.getByTestId('next');
        expect(continueButton).not.toBeDisabled();
    });

    it.only('calls handleNext when "Common.Continue" button is clicked', () => {
        const updatedMockData = {
            ...mockData,
            notificationConfigDetails: [
                {
                    objectFilterId: 3,
                    channels: [
                        {
                            channelType: 'EMAIL',
                            lastPoints: [
                                {
                                    id: '1',
                                    type: 'EMAIL',
                                    email: 'linhnn@awing.vn',
                                    templateId: '1',
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        render(
            <MemoryRouter>
                <ConfigFilter {...updatedMockData} />
            </MemoryRouter>
        );

        const continueButton = screen.getByTestId('next');
        fireEvent.click(continueButton);

        expect(screen.getByText('NotificationConfig.FilterObject.SelectNotificationChannel')).toBeInTheDocument();
    });
});
