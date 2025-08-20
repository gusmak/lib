import { Provider } from 'jotai';
import PlaceFilterContainer from './container';
import { PlaceFilterProps } from './interface';

export function PlaceFilter(props: PlaceFilterProps) {
    return (
        <Provider>
            <PlaceFilterContainer {...props} />
        </Provider>
    );
}
export * from './interface';
export * from './container';
export * from './Enum';
export default PlaceFilter;
