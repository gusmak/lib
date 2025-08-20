import { Grid, Typography, Box } from '@mui/material';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { TreeItem, SimpleTreeView } from '@mui/x-tree-view';
import { type ConvertObjectDefinition } from 'Features/SYSTEM/Schema';
import TemplateFieldView from './TemplateFieldView';
import { useState } from 'react';

type FieldsProps = {
    treeDatas: ConvertObjectDefinition[];
    label: string;
};

export default function Fields(props: FieldsProps) {
    const { treeDatas, label } = props;
    const [expanded, setExpanded] = useState<string[]>([]);

    const handleToggle = (_event: any, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    return (
        <Grid container>
            <SimpleTreeView
                aria-label="controlled"
                slots={{ collapseIcon: ExpandMore, expandIcon: ChevronRight }}
                expandedItems={expanded}
                onExpandedItemsChange={handleToggle}
                //KV: TODO: mới tạm fixed chuyển sang thư viện mới TREEVIEW, cần fixed lại 2 thuộc tính dưới đây sau
                // selected={selected}
                // onNodeSelect={handleSelect}
                style={{ width: '100%', paddingBottom: '16px' }}
                disableSelection={true}
            >
                <TreeItem
                    itemId={'root'}
                    label={
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography>{label}</Typography>
                            </Box>
                        </div>
                    }
                >
                    {treeDatas.map((fieldInfo: ConvertObjectDefinition, index: number) => (
                        <TemplateFieldView key={index} fieldInfo={fieldInfo} />
                    ))}
                </TreeItem>
            </SimpleTreeView>
        </Grid>
    );
}
