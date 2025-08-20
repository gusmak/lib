import { render } from '@testing-library/react';
import { StyledCheck, StyledTableCell } from '../Styled';

describe('StyledCheck', () => {
    it('should render', () => {
        const wrapper = render(<StyledCheck />);
        expect(wrapper).toMatchSnapshot();
    });
});

describe('StyledTableCell', () => {
    it('should render', () => {
        const wrapper = render(<StyledTableCell />);
        expect(wrapper).toMatchSnapshot();
    });
});
