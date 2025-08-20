import { isUndefined } from 'lodash';
import { RootFilter } from './Types';

/* Lấy toàn bộ parent của đối tượng */
export function getParentGroupKey<FieldName>(
    rootFilters: RootFilter<FieldName>[],
    filter: RootFilter<FieldName>,
    list: RootFilter<FieldName>[] = []
) {
    const temp = [...list];
    if (!isUndefined(filter?.parentGroupKey)) {
        const parents = rootFilters.filter((r) => r.value === filter.parentGroupKey);
        if (parents.length === 1 && !temp.find((t) => t.value === parents[0].value)) {
            temp.push(parents[0]);
            return getParentGroupKey(rootFilters, parents[0], temp);
        }
    }

    return temp;
}
