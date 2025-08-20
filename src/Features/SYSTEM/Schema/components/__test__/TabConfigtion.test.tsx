import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TabConfigtion from '../TabConfigtion';
import { SchemaContext } from '../../context';

jest.mock('../SchemaInformation', () => () => {
    return <div>SchemaInformation</div>;
});

const mockOnChange = jest.fn();

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Tabs: (props: any) => {
        const { children, onChange = mockOnChange } = props;
        return (
            <div>
                {props.value}
                <button data-testid="Tabs-onChange" onClick={(e: any) => onChange(e, e.target.tabValue)}>
                    Tabs onChange
                </button>
                {children}
            </div>
        );
    },
}));

export const Render = () =>
    render(
        <SchemaContext.Provider value={{}}>
            <TabConfigtion />
        </SchemaContext.Provider>
    );

describe('Render and Actions', () => {
    it('should render tab label', () => {
        Render();
        expect(screen.queryByText('Schema.Tab.Information')).toBeInTheDocument();
    });

    it('should call change Tab', () => {
        Render();
        fireEvent.click(screen.getByTestId('Tabs-onChange'), { target: { tabValue: '1' } });

        waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({ tabValue: '1' }, '1');
        });
    });
});
