import { GroupTableProps } from './interface';
import GroupTableComponent from './GroupTable';

export default function GroupTable<T extends object>(props: GroupTableProps<T>) {
    return <GroupTableComponent {...props} />;
}
