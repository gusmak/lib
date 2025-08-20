import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DirectoryTree from '../DirectoryTree';
import { DirectoryTreeProps } from '../interface';
import { useDirectoryTreeStyles } from '../components/Styled';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../components/Styled', () => ({
    useDirectoryTreeStyles: jest.fn(),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    ButtonBase: (props: any) => (
        <div>
            <p data-testid="ButtonBase-children">{props.children}</p>
            <button data-testid="ButtonBase-onClick" onClick={(e: any) => props.onClick(e)} />
        </div>
    ),
    Popper: (props: any) => {
        return (
            <div>
                <p>Popper</p>
                <p data-testid="Popper-open">{Boolean(props.open)}</p>
                <p data-testid="Popper-id">{props.id}</p>
                {props.children}
            </div>
        );
    },
    ClickAwayListener: (props: any) => {
        return (
            <div>
                <p>ClickAwayListener</p>
                <button data-testid="ClickAwayListener-onClickAway" onClick={props.onClickAway} />
                {props.children}
            </div>
        );
    },
}));

jest.mock('../FilterTreeView', () => ({
    __esModule: true,
    default: (props: any) => {
        return (
            <div>
                <p>FilterTreeView</p>
                <p data-testid="FilterTreeView-rootDirectoryId"> {props.rootDirectoryId}</p>
                <button data-testid="FilterTreeView-onDirectoryOpen" onClick={(e: any) => props.onDirectoryOpen(e.target.id)} />
                <button data-testid="FilterTreeView-onTreeItemClick" onClick={(e: any) => props.onTreeItemClick(e.target.id)} />
            </div>
        );
    },
}));

const initProps: DirectoryTreeProps = {
    labelSearch: 'labelSearch',
    titleSearch: 'titleSearch',
    options: [],
    rootDirectoryId: 'rootDirectoryId',
    defaultValue: 'value1',
    onChange: () => {},
};
const Component = (props?: DirectoryTreeProps) => render(<DirectoryTree {...initProps} {...props} />);

beforeEach(() => {
    (useDirectoryTreeStyles as jest.Mock).mockReturnValue({
        root: 'root',
        button: 'button',
        popper: 'popper',
        header: 'header',
        contentDirectoryTree: 'contentDirectoryTree',
    });
});
describe('Render', () => {
    it('should render DirectoryTree', () => {
        Component({
            ...initProps,
            titleSearch: undefined,
        });
        expect(screen.queryByText('Common.Select labelsearch')).toBeInTheDocument();
    });

    it('should render DirectoryTree', () => {
        Component({
            ...initProps,
            titleSearch: 'titleSearch',
        });
        expect(screen.queryByText('titleSearch')).toBeInTheDocument();
    });
});
describe('Actions', () => {
    it('should render DirectoryTree', () => {
        Component({
            ...initProps,
            options: [
                { text: 'label1', value: 'value1' },
                { text: 'label2', value: 'value2' },
            ],
        });

        fireEvent.click(screen.getByTestId('ButtonBase-onClick'), { currentTarget: 'button' });
        expect(screen.queryByTestId('Popper-open')).toBeInTheDocument();
    });

    it('should call FilterTreeView onDirectoryOpen', () => {
        const mockOnDirectoryOpen = jest.fn();
        Component({
            ...initProps,
            onDirectoryOpen: mockOnDirectoryOpen,
        });

        fireEvent.click(screen.getByTestId('FilterTreeView-onDirectoryOpen'), { target: { id: 2 } });
        expect(mockOnDirectoryOpen).toHaveBeenCalledWith('2');
    });

    it('should call  ClickAwayListener onClickAway', () => {
        const mockOnChange = jest.fn();
        Component({
            ...initProps,
            options: [
                { text: 'label1', value: 'value1' },
                { text: 'label2', value: 'value2' },
            ],
            onChange: mockOnChange,
        });

        fireEvent.click(screen.getByTestId('ClickAwayListener-onClickAway'));

        waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith('2');
        });
    });

    it('should call FilterTreeView onTreeItemClick', () => {
        const mockOnChange = jest.fn();
        Component({
            ...initProps,
            options: [
                { text: 'label1', value: 'value1' },
                { text: 'label2', value: 'value2' },
            ],
            onChange: mockOnChange,
        });

        fireEvent.click(screen.getByTestId('FilterTreeView-onTreeItemClick'), { target: { id: 2 } });

        waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith('2');
        });
    });
});
