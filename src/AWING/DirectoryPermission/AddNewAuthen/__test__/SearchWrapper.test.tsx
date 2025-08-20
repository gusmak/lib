import { render, screen, fireEvent } from '@testing-library/react';
import SearchWrapper from '../SearchWrapper';
import { authenHasDifference } from '../../utils';
import { SearchWrapperProps } from '../types';

// #region Mount
const initProps: SearchWrapperProps = {
    authenIds: {
        ROLE: [],
        USER: [],
        GROUP: [],
    },
    authens: {
        ROLE: [],
        USER: [],
        GROUP: [],
    },
    onAuthenIdsChange: jest.fn(),
};

const getRender = (props?: Partial<SearchWrapperProps>) => {
    render(<SearchWrapper {...initProps} {...props} />);
};
// #endregion Mount

// #region Mock
jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({ t: (str: string) => str }),
}));

jest.mock('../../utils', () => ({
    ...jest.requireActual('../../utils'),
    authenHasDifference: jest.fn(),
}));

jest.mock('AWING', () => ({
    SearchBox: ({ onSearch }: any) => {
        return (
            <div>
                <p data-testid="SearchBox-header">SearchBox</p>
                <input data-testid="SearchBox-onSearch" type="text" onChange={(e: any) => onSearch('', e.target.value)} />
            </div>
        );
    },
}));

jest.mock('../../components/AuthenList', () => ({
    __esModule: true,
    default: (props: any) => {
        return (
            <div>
                <p data-testid="AuthenList-header">AuthenList</p>
                <p data-testid="AuthenList-title">{props?.title}</p>
                <div>
                    {/* render authens */}
                    {props?.authens?.map((a: any) => (
                        <div key={a?.id}>
                            <span data-testid={`authen-${a?.id}-type`}>{a?.type}</span>
                            <span data-testid={`authen-${a?.id}-name`}>{a?.name}</span>
                        </div>
                    ))}
                </div>
                <div data-testid="selected-authen-ids">{props?.selectedAuthenIds?.map((id: any) => id)}</div>
                <button
                    type="button"
                    data-testid={`AuthenList-onChangeAuthenIds-${props?.authens[0]?.type}`}
                    onClick={(e: any) => props?.onChangeAuthenIds(e.target.authenIds, e.target.authenType)}
                />
            </div>
        );
    },
}));
// #endregion Mock

beforeEach(() => {
    (authenHasDifference as jest.Mock).mockReturnValue(true);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('Render', () => {
    it('should render correctly', () => {
        (authenHasDifference as jest.Mock).mockReturnValue(false);
        getRender();

        expect(screen.getByTestId('SearchBox-header')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('should call onSearch on SearchBox', () => {
        getRender();

        const searchInput = screen.getByTestId('SearchBox-onSearch');
        fireEvent.change(searchInput, {
            target: { value: 'abc' },
        });

        expect(searchInput).toHaveValue('abc');
    });

    it('should call onChangeAuthenIds on AuthenList with ROLE type', () => {
        const mockonRoleIdsChange = jest.fn();
        getRender({
            authens: {
                ROLE: [{ id: 1, name: 'role', type: 'ROLE' }],
                USER: [],
                GROUP: [],
            },
            onAuthenIdsChange: mockonRoleIdsChange,
        });

        fireEvent.click(screen.getByTestId('AuthenList-onChangeAuthenIds-ROLE'), {
            target: { authenIds: [1], authenType: 'ROLE' },
        });

        expect(mockonRoleIdsChange).toHaveBeenCalledWith([1], 'ROLE');
    });

    it('should call onChangeAuthenIds on AuthenList with USER type', () => {
        const mockOnUserIdsChange = jest.fn();
        getRender({
            authens: {
                ROLE: [],
                USER: [{ id: 1, name: 'user', type: 'USER' }],
                GROUP: [],
            },
            onAuthenIdsChange: mockOnUserIdsChange,
        });

        fireEvent.click(screen.getByTestId('AuthenList-onChangeAuthenIds-USER'), {
            target: { authenIds: [1], authenType: 'USER' },
        });

        expect(mockOnUserIdsChange).toHaveBeenCalledWith([1], 'USER');
    });

    it('should call onChangeAuthenIds on AuthenList with GROUP type', () => {
        const mockOnGroupIdsChange = jest.fn();
        getRender({
            authens: {
                ROLE: [],
                USER: [],
                GROUP: [{ id: 1, name: 'group', type: 'GROUP' }],
            },
            onAuthenIdsChange: mockOnGroupIdsChange,
        });

        fireEvent.click(screen.getByTestId('AuthenList-onChangeAuthenIds-GROUP'), {
            target: { authenIds: [1], authenType: 'GROUP' },
        });

        expect(mockOnGroupIdsChange).toHaveBeenCalledWith([1], 'GROUP');
    });
});
