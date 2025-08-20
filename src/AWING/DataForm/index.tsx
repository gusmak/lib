import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import DataFormContainer from './container';
import { DataFormProps } from './interface';

export function DataForm<T extends object = object>(props: DataFormProps<T>) {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DataFormContainer {...props} />
        </LocalizationProvider>
    );
}

export * from './interface';
export default DataForm;
