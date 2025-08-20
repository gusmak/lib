/* eslint-disable */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import UserInGroupComponent from './component';
import '@testing-library/jest-dom';

// Mock các dependencies
jest.mock('../EnhancedTable', () => ({
    __esModule: true,
    default: ({ rows, onChangeDeleted }: any) => (
        <div data-testid="enhanced-table">
            <button onClick={() => onChangeDeleted(['1', '2'], 'delete')} data-testid="delete-button">
                Delete Users
            </button>
        </div>
    ),
}));

jest.mock('../SearchUser', () => ({
    __esModule: true,
    default: ({ onChangeAddUser, usersSelected }: any) => (
        <div data-testid="search-user">
            <button onClick={() => onChangeAddUser([{ id: '3', name: 'User 3' }])} data-testid="add-button">
                Add User
            </button>
        </div>
    ),
}));

// Mock constants
jest.mock('../../../../Commons/Constant', () => ({
    Constants: {
        ADD_USER_TO_GROUP_PATH: '/add-user',
    },
}));

describe('UserInGroupComponent', () => {
    const mockRows = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
    ];

    const mockOnSubmitData = jest.fn();

    const defaultProps = {
        rows: mockRows,
        onSubmitData: mockOnSubmitData,
        isAcceptanced: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders EnhancedTableComponent', () => {
        render(
            <MemoryRouter>
                <UserInGroupComponent {...defaultProps} />
            </MemoryRouter>
        );

        expect(screen.getByTestId('enhanced-table')).toBeInTheDocument();
    });

    it('handles user deletion correctly', () => {
        render(
            <MemoryRouter>
                <UserInGroupComponent {...defaultProps} />
            </MemoryRouter>
        );

        const deleteButton = screen.getByTestId('delete-button');
        fireEvent.click(deleteButton);

        expect(mockOnSubmitData).toHaveBeenCalledTimes(1);
        expect(mockOnSubmitData).toHaveBeenCalledWith([]);
    });

    it('handles adding new users correctly', () => {
        render(
            <MemoryRouter initialEntries={['/add-user']}>
                <UserInGroupComponent {...defaultProps} />
            </MemoryRouter>
        );

        const addButton = screen.getByTestId('add-button');
        fireEvent.click(addButton);

        expect(mockOnSubmitData).toHaveBeenCalledTimes(1);
        expect(mockOnSubmitData).toHaveBeenCalledWith([
            { id: '1', name: 'User 1' },
            { id: '2', name: 'User 2' },
            { id: '3', name: 'User 3' },
        ]);
    });

    it('does not call onSubmitData when it is not provided', () => {
        const propsWithoutSubmit = {
            rows: mockRows,
            isAcceptanced: false,
        };

        render(
            <MemoryRouter>
                <UserInGroupComponent {...propsWithoutSubmit} />
            </MemoryRouter>
        );

        const deleteButton = screen.getByTestId('delete-button');
        fireEvent.click(deleteButton);

        expect(mockOnSubmitData).not.toHaveBeenCalled();
    });

    it('renders SearchUser component on add-user route', () => {
        render(
            <MemoryRouter initialEntries={['/add-user']}>
                <UserInGroupComponent {...defaultProps} />
            </MemoryRouter>
        );

        expect(screen.getByTestId('search-user')).toBeInTheDocument();
    });
});
