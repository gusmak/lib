import { render, fireEvent, screen } from '@testing-library/react';
import SearchUserGroupUser from './component';
import '@testing-library/jest-dom';
import React from 'react';
// Mock các component từ AWING
jest.mock('../../../../AWING', () => ({
    NoData: () => <div data-testid="no-data">No Data</div>,
    SearchBox: ({ onSearch, style }) => (
        <input type="text" data-testid="search-box" style={style} onChange={(e) => onSearch('', e.target.value)} />
    ),
}));

// Mock MUI component
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Checkbox: ({ checked, onChange, value }) => (
        <input type="checkbox" data-testid={`checkbox-${value}`} checked={checked} onChange={onChange} value={value} />
    ),
}));

// Mock Grid component
jest.mock('@mui/material/Grid', () => ({
    __esModule: true,
    default: ({ children, container, sx }) => <div data-testid="grid">{children}</div>,
}));

describe('SearchUserGroupUser', () => {
    const mockUsers = [
        { id: 1, username: 'user1' },
        { id: 2, username: 'user2' },
        { id: 3, username: 'admin1' },
    ];

    const mockOnListUserIdChange = jest.fn();

    const defaultProps = {
        listUserId: [1],
        onListUserIdChange: mockOnListUserIdChange,
        users: mockUsers,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders search box', () => {
        render(<SearchUserGroupUser {...defaultProps} />);
        expect(screen.getByTestId('search-box')).toBeInTheDocument();
    });

    test('filters users based on search input', () => {
        render(<SearchUserGroupUser {...defaultProps} />);
        const searchInput = screen.getByTestId('search-box');

        fireEvent.change(searchInput, { target: { value: 'admin' } });

        expect(screen.getByText('admin1')).toBeInTheDocument();
        expect(screen.queryByText('user1')).not.toBeInTheDocument();
        expect(screen.queryByText('user2')).not.toBeInTheDocument();
    });

    test('shows NoData component when no results found', () => {
        render(<SearchUserGroupUser {...defaultProps} />);
        const searchInput = screen.getByTestId('search-box');

        fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

        expect(screen.getByTestId('no-data')).toBeInTheDocument();
    });

    test('empty search shows all users', () => {
        render(<SearchUserGroupUser {...defaultProps} />);
        const searchInput = screen.getByTestId('search-box');

        // First search for something
        fireEvent.change(searchInput, { target: { value: 'admin' } });
        // Then clear the search
        fireEvent.change(searchInput, { target: { value: '' } });

        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.getByText('user2')).toBeInTheDocument();
        expect(screen.getByText('admin1')).toBeInTheDocument();
    });

    test('search is case insensitive', () => {
        render(<SearchUserGroupUser {...defaultProps} />);
        const searchInput = screen.getByTestId('search-box');

        fireEvent.change(searchInput, { target: { value: 'ADMIN' } });

        expect(screen.getByText('admin1')).toBeInTheDocument();

        const checkboxes = screen.getAllByTestId(/^checkbox-/);
        fireEvent.click(checkboxes[0]);
    });
});
