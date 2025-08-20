import { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Grid } from '@mui/material';
import { CircularProgress } from 'AWING';
import TableCollaped from './TableCollaped';
import PanelGroup from './PanelGroup';
import { Cell, Row, OnFilter } from './Types';
import { initializeAtoms } from './Atoms';
import { initPage } from './Constants';

export type DataGridGroupsProps<FieldName extends string> = {
    cells: Cell<FieldName>[];
    defaultFieldGroups?: FieldName[];
    onFilter?: OnFilter<FieldName>;
    onRowClick?: (row: Row) => void;
};

function Container<FieldName extends string>(props: DataGridGroupsProps<FieldName>) {
    const atoms = initializeAtoms<FieldName>();
    const { defaultFieldGroups = [], onFilter, onRowClick } = props;

    /* Atom */
    const pageList = useAtomValue(atoms.pageList);
    const [groupFields, setGroupFields] = useAtom(atoms.groupFields);
    const [cells, setCells] = useAtom(atoms.cells);
    const setFieldNames = useSetAtom(atoms.fieldNames);
    const setRootFilters = useSetAtom(atoms.rootFilters);
    const setPageList = useSetAtom(atoms.pageList);

    /* State */
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchData = async (groups: FieldName[]) => {
        setLoading(true);
        /** Lần đầu load data hoặc click onView */
        if (onFilter) {
            await onFilter(pageList, groups[0])
                .then((res) => {
                    setRows(res.items);
                    setTotalCount(res.totalCount);
                    setLoading(false);
                })
                .catch(() => {
                    setRows([]);
                    setTotalCount(0);
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        /** Xét groupFields và fetch data lần đầu */
        const fieldNames = props.cells.map((cell) => cell.fieldName);
        setFieldNames(fieldNames);
        setCells(props.cells);
        setGroupFields(defaultFieldGroups.filter((g) => fieldNames.includes(g)));
        fetchData(defaultFieldGroups);
    }, []);

    useEffect(() => {
        fetchData(groupFields);
    }, [pageList]);

    /* Call Fetch Data -> Click to onView Button */
    const handleFilter = () => {
        const newCells: Cell<FieldName>[] = [];
        groupFields.forEach((f) => {
            const cell = cells.find((c) => c.fieldName === f);
            if (cell) {
                newCells.push(cell);
            }
        });
        /** Xét lại thứ tự cột theo group */
        setCells([...newCells, ...cells.filter((c) => !groupFields.includes(c.fieldName))]);
        /** Xét lại RootFilters = rỗng */
        setRootFilters([]);
        /** Xét lại Pagination */
        setPageList(initPage);
        /** Fetch Data */
        fetchData(groupFields);
    };

    return (
        <Grid container>
            <PanelGroup onFilter={handleFilter} />
            {loading ? (
                <CircularProgress />
            ) : (
                <TableCollaped onFilter={onFilter} onRowClick={onRowClick} totalCount={totalCount} rows={rows} />
            )}
        </Grid>
    );
}

export default Container;
