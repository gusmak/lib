import { TableCell } from '@mui/material';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { TableCellEditableProps } from '../interface';
import DataInput, { FIELD_TYPE } from 'AWING/DataInput';

const StyleTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} arrow classes={{ popper: className }} />)(
    () => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: '#bbbbbb',
            maxWidth: 450,
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f5',
            maxWidth: 900,
            boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
        },
    })
);

export default function TableCellEditable<T extends object>(props: TableCellEditableProps<T>) {
    const { cellDefinition, numOfRowSpan } = props;
    const { TableCellProps, isTooltip, getTitleTooltip, value, error } = cellDefinition;

    const renderDataInput = () => {
        const inputProps = {
            ...(![FIELD_TYPE.ASYNC_AUTOCOMPLETE, FIELD_TYPE.AUTOCOMPLETE].includes(cellDefinition?.type as FIELD_TYPE)
                ? {
                      InputProps: {
                          disableUnderline: true,
                          style: {
                              textAlign: cellDefinition?.TableCellProps?.align == 'right' ? 'end' : undefined,
                              padding: '0px 8px',
                          },
                      },
                  }
                : {}),
            ...cellDefinition,
            disableHelperText: true,
        };

        return <DataInput {...inputProps} />;
    };

    return (
        <TableCell
            sx={{
                p: 0,
                border: error ? '2px solid #ED1D25' : '1px solid rgb(224, 224, 224)',
            }}
            rowSpan={numOfRowSpan}
            {...TableCellProps}
        >
            {isTooltip ? (
                <StyleTooltip title={(getTitleTooltip && getTitleTooltip(value as T[keyof T])) || ''} placement="top-start">
                    {/* Thêm div vì child của tooltip phải giữ cùng 1 useref với cha. trong khi đó render DataInput giữ 1 ref khác.
                     https://stackoverflow.com/questions/57527896/material-ui-tooltip-doesnt-display-on-custom-component-despite-spreading-props */}
                    <div>{renderDataInput()}</div>
                </StyleTooltip>
            ) : (
                renderDataInput()
            )}
        </TableCell>
    );
}
