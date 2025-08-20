import { render, screen, fireEvent } from '@testing-library/react';
import Receivers from './Receivers';
import { ChannelType, ReceiverField } from 'Features/NOTIFICATION/enums';

jest.mock('@mui/material', () => ({
    Grid: ({ children }: any) => <div data-testid="grid">{children}</div>,
    TextField: ({ label, value, onChange, error, slotProps }: any) => (
        <div data-testid="textfield">
            <label>{label}</label>
            <input value={value} onChange={onChange} data-error={error} />
            <div data-testid="adornment">{slotProps.input.startAdornment}</div>
        </div>
    ),
    InputAdornment: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('Receivers', () => {
    const defaultProps = {
        channelType: ChannelType.EMAIL,
        value: '',
        onChange: jest.fn(),
    };

    it('renders with email channel type', () => {
        render(<Receivers {...defaultProps} />);
        expect(screen.getByText(ChannelType.EMAIL)).toBeInTheDocument();
        expect(screen.getByTestId('textfield')).toBeInTheDocument();
    });

    it('renders with telegram channel type', () => {
        render(<Receivers {...defaultProps} channelType={ChannelType.TELEGRAM} />);
        expect(screen.getByText(ChannelType.TELEGRAM)).toBeInTheDocument();
    });

    it('calls onChange with correct field for email', () => {
        render(<Receivers {...defaultProps} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test@email.com' } });
        expect(defaultProps.onChange).toHaveBeenCalledWith('emailReceivers', 'test@email.com');
    });

    it('calls onChange with correct field for telegram', () => {
        render(<Receivers {...defaultProps} channelType={ChannelType.TELEGRAM} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '123456' } });
        expect(defaultProps.onChange).toHaveBeenCalledWith('telegramReceivers', '123456');
    });

    it('handles null value', () => {
        render(<Receivers {...defaultProps} value={null} />);
        expect(screen.getByRole('textbox')).toHaveValue('');
    });
});
