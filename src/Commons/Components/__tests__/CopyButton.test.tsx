import { fireEvent, render, screen } from '@testing-library/react';
import CopyButton from '../CopyButton';

jest.mock('@mui/material', () => ({
    Tooltip: (props?: any) => (
        <div data-testid="Tooltip">
            <p data-testid="Tooltip-title">{props?.title}</p>
            {props?.children}
        </div>
    ),
    IconButton: (props?: any) => (
        <div>
            <button data-testid="IconButton-onClick" onClick={(e: any) => props?.onClick(e)} />
            <button data-testid="IconButton-onBlur" onClick={(e: any) => props?.onBlur(e)} />
            {props?.children}
        </div>
    ),
}));

const getRender = (props?: any) => {
    render(<CopyButton id="copybutton" {...props} />);
};

describe('Render and Actions', () => {
    it('should render', () => {
        getRender();

        expect(screen.getByTestId('Tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('Tooltip-title')).toHaveTextContent('Campaign.ClickToCopy');
    });

    it('should copied', () => {
        getRender();

        fireEvent.click(screen.getByTestId('IconButton-onClick'));
        expect(screen.getByTestId('Tooltip-title')).toHaveTextContent('Campaign.Copied');
    });

    it('should onBlur', () => {
        getRender();

        fireEvent.click(screen.getByTestId('IconButton-onBlur'));
        expect(screen.getByTestId('Tooltip-title')).toHaveTextContent('Campaign.ClickToCopy');
    });
});
