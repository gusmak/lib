import { useTranslation } from 'react-i18next';
import MultipleHierarchicalChoice, {
    IMultipleHierarchicalChoiceInput,
    IMultipleHierarchicalChoiceProps,
} from 'AWING/MultipleHierarchicalChoice';
import i18next from 'translate/i18n';
import { arrayIsNotEmptyValid } from 'AWING/ultis';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface MultipleHierarchicalDefinition
    extends Omit<BaseFieldDefinition<IMultipleHierarchicalChoiceInput[][]>, 'helperText'>,
        Omit<IMultipleHierarchicalChoiceProps, 'defaultValue' | 'onChange' | 'error'> {
    type: FIELD_TYPE.MULTIPLE_HIERARCHICAL;
}

export const MultipleHierarchicalInput = (fieldDefinition: MultipleHierarchicalDefinition) => {
    const { t } = useTranslation(undefined, { i18n: i18next });
    const { value, onChange, error, disableHelperText, helperText, onValidateCustom, ...other } = fieldDefinition;

    const onValidate = (val: IMultipleHierarchicalChoiceInput[][]): boolean => {
        if (onValidateCustom) {
            return onValidateCustom(val);
        }
        return arrayIsNotEmptyValid(val);
    };

    return (
        <MultipleHierarchicalChoice
            variant="standard"
            value={value}
            onChange={(value) => {
                onChange && onChange(value, onValidate(value));
            }}
            error={error}
            helperText={!disableHelperText && error ? (helperText ?? t('Common.InvalidData')) : ''}
            {...other}
        />
    );
};

export default MultipleHierarchicalInput;
