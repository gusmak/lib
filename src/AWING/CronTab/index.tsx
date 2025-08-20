import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import CronTabComponent from './CronTab';
import { CronTabProps } from './interface';

export function CronTab(props: CronTabProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <CronTabComponent {...props} />
        </LocalizationProvider>
    );
}

export * from './interface';
export default CronTab;
