import { render, screen } from '@testing-library/react';
import CustomInput from '../CustomInput';
import { FIELD_TYPE } from '../../enums';

const getRender = (props?: any) => {
    render(
        <CustomInput
            fieldName="radio_input"
            type={FIELD_TYPE.CUSTOM}
            component={<div data-testid="customComponent">This is custom component</div>}
            {...props}
        />
    );
};

describe('Render', () => {
    it('should render correctly', () => {
        getRender();

        expect(screen.getByTestId('customComponent')).toBeInTheDocument();
    });
});
