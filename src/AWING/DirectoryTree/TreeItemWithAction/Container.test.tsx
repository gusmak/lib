import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Container from './Container';
import { TreeItemWithActionProps } from './types';

const initProps: TreeItemWithActionProps = {
    itemId: '',
    labelIcon: null,
    labelText: '',
};

const Component = (props?: TreeItemWithActionProps) => render(<Container {...initProps} {...props} />);

jest.mock('@mui/x-tree-view', () => ({
    TreeItem: (props: any) => {
        const { itemId, label, sx } = props;

        const sxParam = sx({
            palette: {
                background: { paper: 'red' },
            },
            spacing: () => '',
            shadows: [],
        });

        return (
            <div>
                <p>TreeItem</p>
                <p data-testid="TreeItem-itemId">{itemId}</p>
                <div>{label}</div>
                <textarea data-testid="TreeItem-sx-background">{sxParam['& .MuiTreeItem-content'].backgroundColor}</textarea>
            </div>
        );
    },
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Stack: (props: any) => {
        const { sx } = props;
        const sxParam = sx();

        return (
            <div>
                <button data-testid="Stack-onClick" onClick={props.onClick} />
                <textarea data-testid="Stack-sx-display">{JSON.stringify(sxParam)}</textarea>
                {props.children}
            </div>
        );
    },
}));

jest.mock('../components/Styled', () => ({
    LabelDiv: (props: any) => (
        <div data-testid="LabelDiv">
            <button data-testid="LabelDiv-onMouseEnter" onClick={props.onMouseEnter} />
            <button data-testid="LabelDiv-onMouseLeave" onClick={props.onMouseLeave} />
            <button data-testid="LabelDiv-onClickCapture" onClick={props.onClickCapture} />
            {props.children}
        </div>
    ),
}));

describe('Render', () => {
    it('should render itemId', () => {
        Component({
            ...initProps,
            itemId: '1',
        });

        expect(screen.queryByTestId('TreeItem-itemId')).toHaveTextContent('1');
    });

    it('should render labelIcon', () => {
        Component({
            ...initProps,
            labelIcon: <p data-testid="TreeItem-labelIcon">labelIcon</p>,
        });
        fireEvent.click(screen.getByTestId('LabelDiv-onMouseEnter'));
        expect(screen.queryByTestId('TreeItem-labelIcon')).toHaveTextContent('labelIcon');
    });

    it('should render labelText', () => {
        Component({
            ...initProps,
            labelText: 'TreeItem-labelText',
        });
        fireEvent.click(screen.getByTestId('LabelDiv-onMouseLeave'));
        expect(screen.queryByText('TreeItem-labelText')).toBeInTheDocument();
    });

    it('should render sx stype props', () => {
        Component({
            ...initProps,
        });
        expect(screen.queryByTestId('TreeItem-sx-background')).toHaveTextContent('red');
    });

    it('should call Stack-onClick', () => {
        const mockStopPropagation = jest.fn();
        Component();

        fireEvent.click(screen.getByTestId('Stack-onClick'), { stopPropagation: mockStopPropagation });
        waitFor(() => {
            expect(mockStopPropagation).toHaveBeenCalled();
        });
    });
});
