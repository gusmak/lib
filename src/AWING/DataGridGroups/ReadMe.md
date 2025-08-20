## Bài toán:

-   Show table một danh sách được lấy từ API
-   Cho phép kéo thả tiêu để cột của table lên Panels <PanelComponent />
-   Cho phép sắp xếp, delete panels <PanelComponent />
-   Colapse/Expand 1 row trên table, hiển thị dạng danh sách group, mỗi lần => Call onFilter
-   Recursive row
-   Phân trang

# Props:

```
    cells: {
        fieldName: string;
        label: string;
        draggable?: boolean;
        colWidth?: string;
    }[],
    defaultFieldGroups?: string[],
    onFilter?: (
        page: {
            pageSize: number;
            pageIndex: number;
        },
        /* Giá trị hiện tại được group  */
        groupBy?: string,
        /* Danh sách filter, nếu mở các row */
        filters?: { key: string; value: string }[]
    ) => Promise<{
        items: Record<string | 'groupKeyId', string>[];
        totalCount: number;
    }>
```

## Sử dụng

```
    import DataGridGroup from 'AWING';

    const ComponentDemo = () => {
        const handleFilter = () => {
            // call API here
        }

        return (

            <DataGridGroup
                cells={[]}
                defaultFieldGroups={[]}
                onFilter={handleFilter}
            />
        )
    }
```
