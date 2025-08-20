import { render, cleanup, fireEvent } from '@testing-library/react';
import Information from './Information';

jest.mock('AWING', () => {
    return {
        ...jest.requireActual('AWING'),
        DataForm: (props: any) => <input role="input" onClick={() => props.onUpdate(props.oldValue, true, 'u')} />,
    };
});

describe('Information component', () => {
    const mockOnUpdateFormValid = jest.fn();
    const defaultFormData = {
        name: '',
        objectTypeCode: '',
        stateFieldName: '',
        description: '',
    };
    afterEach(() => {
        jest.resetAllMocks();
        cleanup();
    });

    it('should render', () => {
        const { getAllByRole } = render(
            <Information
                formData={defaultFormData}
                onUpdateFormValid={mockOnUpdateFormValid}
                objectTypeCodeMap={[{ value: 'v', label: 'l' }]}
            />
        );

        const input = getAllByRole('input');
        expect(input).toHaveLength(1);

        fireEvent.click(input[0]);

        expect(mockOnUpdateFormValid.mock.calls.length).toEqual(1);
        expect(mockOnUpdateFormValid).toHaveBeenCalledWith(defaultFormData, true, 'u');
    });
});
