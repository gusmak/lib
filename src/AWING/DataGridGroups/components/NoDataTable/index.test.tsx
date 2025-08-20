import { render, screen } from '@testing-library/react';
import NoDataTable from './index';

const getRender = (props?: any) => {
    render(<NoDataTable {...props} />);
};

describe('Render', () => {
    it('should render with title', () => {
        getRender({
            title: 'Demo Title',
        });

        expect(screen.getByText('Demo Title')).toBeInTheDocument();
    });

    it('should render with title default', () => {
        getRender();

        expect(screen.getByText('Common.NoData')).toBeInTheDocument();
    });
});
