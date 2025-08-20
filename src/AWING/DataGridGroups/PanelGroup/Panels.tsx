import { Fragment, useMemo, type DragEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { HighlightOff as HighlightOffIcon } from '@mui/icons-material';
import { Chip, Paper, Typography } from '@mui/material';
import { DATA_TRANSFER_DRAG_DROP } from '../Constants';
import { initializeAtoms } from '../Atoms';
import { COLOR } from '../Enums';
import type { Cell } from '../Types';

function GroupPanel<FieldName extends string>() {
    const { t } = useTranslation();
    const atoms = initializeAtoms<FieldName>();

    /* Atom */
    const cells = useAtomValue(atoms.cells);
    const [groupFields, setGroupFields] = useAtom(atoms.groupFields);
    const fieldNames = useAtomValue(atoms.fieldNames);
    const setDragging = useSetAtom(atoms.dragging);

    const handleDelete = (id: string) => {
        setGroupFields(groupFields.filter((o) => o !== id));
    };

    /* Lấy ra thông tin các Cell theo groupFields */
    const panelCells = useMemo(() => {
        const results: Cell<FieldName>[] = [];
        groupFields?.forEach((cell) => {
            const crCell = cells.find((o) => o.fieldName === cell);
            crCell && results.push(crCell);
        });
        return results;
    }, [groupFields]);

    const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
        const crPanel = groupFields[index];
        e.dataTransfer?.setData(DATA_TRANSFER_DRAG_DROP, crPanel);
        setDragging(true);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.border = `1px solid ${COLOR.PRIMARY}`;
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.style.border = '1px solid #ccc';
        const dragNodeId = e.dataTransfer?.getData(DATA_TRANSFER_DRAG_DROP);
        const match = fieldNames?.find((o) => o === dragNodeId);

        if (match) {
            const currentFieldName = dragNodeId as FieldName;
            setDragging(false);
            if (!groupFields.includes(currentFieldName)) {
                setGroupFields([...groupFields, currentFieldName]);
            }
            e.dataTransfer?.clearData(DATA_TRANSFER_DRAG_DROP);
        }
    };

    const handleSort = (e: DragEvent<HTMLDivElement>, fieldName: string) => {
        const dragNodeId = e.dataTransfer?.getData(DATA_TRANSFER_DRAG_DROP);
        const dropIndex = groupFields.findIndex((cell) => cell === fieldName);
        const indexMatch = groupFields.findIndex((cell) => cell === dragNodeId);
        let newPanels = [...groupFields];
        newPanels.splice(indexMatch, 1, groupFields[dropIndex]);
        newPanels.splice(dropIndex, 1, groupFields[indexMatch]);
        setGroupFields(newPanels);
        e.dataTransfer?.clearData(DATA_TRANSFER_DRAG_DROP);
    };

    return (
        <Fragment>
            <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                    position: 'absolute',
                    top: '-3px',
                    left: '16px',
                    backgroundColor: '#FFFFFF',
                    paddingRight: '4px',
                    paddingLeft: '4px',
                    marginTop: '6px',
                    zIndex: 2,
                }}
            >
                <span style={{ opacity: 0.5 }}>{t('Schedule.DragAndDropLabel')}</span>
            </Typography>
            <Paper
                component="div"
                id="group-panel"
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    paddingTop: '8px',
                    margin: 0,
                    height: '40px',
                    position: 'relative !important',
                    '&.MuiPaper-elevation1': {
                        boxShadow: 'none',
                        border: '1px solid #ccc',
                    },
                    minHeight: '30px',
                    '&:hover': {
                        '&.MuiPaper-elevation1': {
                            boxShadow: 'none',
                            border: '1px solid #263238',
                        },
                    },
                    boxSizing: 'border-box',
                }}
                onDragOver={handleDragOver}
                onDragLeave={(e) => (e.currentTarget.style.border = `1px solid ${COLOR.SECONDARY}`)}
                onDrop={handleDrop}
            >
                {panelCells?.map((cell, index) => {
                    return (
                        <Fragment key={index}>
                            {cell && (
                                <Chip
                                    size="small"
                                    label={cell.label ?? cell.fieldName}
                                    id={cell.fieldName}
                                    onDelete={() => handleDelete(cell.fieldName)}
                                    deleteIcon={<HighlightOffIcon />}
                                    sx={{ marginLeft: '1rem', border: '1px solid transparent' }}
                                    draggable
                                    onDragStart={(e: DragEvent<HTMLDivElement>) => {
                                        handleDragStart(e, index);
                                    }}
                                    onDragOver={(e: DragEvent<HTMLDivElement>) => {
                                        e.preventDefault();
                                        e.currentTarget.style.border = `1px solid ${COLOR.SECONDARY}`;
                                    }}
                                    onDragLeave={(e: DragEvent<HTMLDivElement>) => {
                                        e.currentTarget.style.border = `1px solid ${COLOR.BG}`;
                                    }}
                                    onDrop={(e: DragEvent<HTMLDivElement> & { parentNode: {} }) => {
                                        e.currentTarget.style.border = `1px solid ${COLOR.BG}`;
                                        e.preventDefault();

                                        const eventTarget = e.target as HTMLElement & { parentNode: { id: string } };
                                        handleSort(e, eventTarget.parentNode.id ?? '');
                                    }}
                                />
                            )}
                        </Fragment>
                    );
                })}
            </Paper>
        </Fragment>
    );
}

export default GroupPanel;
