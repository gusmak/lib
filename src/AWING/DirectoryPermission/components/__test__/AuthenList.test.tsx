import { fireEvent, render, screen } from '@testing-library/react';
import AuthenList, { OwnProps } from '../AuthenList';

const initProps: OwnProps = {
    authens: [],
    selectedAuthenIds: [],
    title: 'AuthenList',
    onChangeAuthenIds: jest.fn(),
};
const getRender = (props?: Partial<OwnProps>) => render(<AuthenList {...initProps} {...props} />);

//#region mock @mui

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Checkbox: (props: any) => {
        return (
            <div>
                <p>Checkbox</p>
                <input type="checkbox" data-testid={`input-checked-${props.value}`} checked={props.checked} value={props.value} />
                <button data-testid={`Checkbox-onChange-${props.value}`} onClick={props.onChange} />
            </div>
        );
    },
}));
//#endregion

describe('render', () => {
    it('should render', () => {
        getRender();
        expect(screen.queryByText('AuthenList')).toBeNull();
    });

    it('should render', () => {
        const authens = [
            {
                id: 1,
                name: 'Authen 1',
                type: 'USER',
            },
            {
                id: 2,
                name: 'Authen 2',
                type: 'USER',
            },
            {
                id: 3,
                name: 'Authen 3',
                type: 'USER',
            },
        ];
        getRender({
            authens,
            onChangeAuthenIds: jest.fn(),
        });

        expect(screen.queryByText(`AuthenList (${authens.length})`)).toBeInTheDocument();
    });
});

describe('Actions', () => {
    const authens = [
        {
            id: 1,
            name: 'Authen 1',
            type: 'USER',
        },
        {
            id: 2,
            name: 'Authen 2',
            type: 'USER',
        },
        {
            id: 3,
            name: 'Authen 3',
            type: 'USER',
        },
    ];

    it('should call onChangeAuthenIds', () => {
        const mockOnChangeAuthenIds = jest.fn();

        getRender({
            authens,
            selectedAuthenIds: [1],
            onChangeAuthenIds: mockOnChangeAuthenIds,
        });

        fireEvent.click(screen.getByTestId('Checkbox-onChange-1'), {
            target: {
                checked: true,
            },
        });
        expect(mockOnChangeAuthenIds).toHaveBeenCalledWith([1, 1], 'USER');
    });

    it('should call ', () => {
        const mockOnChangeAuthenIds = jest.fn();

        getRender({
            authens,
            selectedAuthenIds: [1],
            onChangeAuthenIds: mockOnChangeAuthenIds,
        });

        fireEvent.click(screen.getByTestId('Checkbox-onChange-2'), {
            target: {
                checked: false,
            },
        });
        expect(mockOnChangeAuthenIds).toHaveBeenCalledWith([1], 'USER');
    });
});
