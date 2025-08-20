import { render, screen } from '@testing-library/react';
import AreaSelectField from '.';
import Province from '../../../../stories/data/province-data.json';

describe('ACM > PlaceFilter > Input > AreaSelectField', () => {
    const mockOnChange = jest.fn((value) => {});
    it('Check component exist', async () => {
        const Wrapper = () => {
            return (
                <div>
                    <AreaSelectField initValue={[]} label="Area" onChange={mockOnChange} inputParameter={Province} />
                </div>
            );
        };
        render(<Wrapper />);
        expect((await screen.findAllByText('Area')).length).toEqual(2);
    });
});
