import { render, screen } from '@testing-library/react';
import Container from '../RadioInput';
import { FIELD_TYPE } from '../../enums';

const getRender = (props?: any) => {
    render(
        <Container
            fieldName="radio_input"
            type={FIELD_TYPE.RADIO}
            options={[
                {
                    text: 'option 1',
                    value: 'option_1',
                },
                {
                    text: 'option 2',
                    value: 'option_2',
                },
            ]}
            {...props}
        />
    );
};

describe('Render', () => {
    it('renders radio group correctly', () => {
        getRender();

        expect(screen.queryAllByRole('radio')).toHaveLength(2);
    });
});
