import { FC, useCallback, useEffect, useState } from 'react';
import AreaSelectFieldComponent, { AutocompleteOnChange } from './component';
import { IMultipleHierarchicalChoiceInput } from 'AWING/MultipleHierarchicalChoice';
interface AreaSelectFieldProps {
    initValue: IMultipleHierarchicalChoiceInput[];
    label: string;
    placeholders?: string[];
    inputParameter?: IMultipleHierarchicalChoiceInput[];
    onChange: (value: IMultipleHierarchicalChoiceInput[]) => void;
    value?: IMultipleHierarchicalChoiceInput[];
}

const AreaSelectField: FC<AreaSelectFieldProps> = (props) => {
    const { initValue, label, placeholders, inputParameter, onChange, value } = props;
    const [options, setOptions] = useState<IMultipleHierarchicalChoiceInput[]>([]);
    const [currentPlaceHolder, setCurrentPlaceHolder] = useState('');
    const [areaSelected, setAreaSelected] = useState<IMultipleHierarchicalChoiceInput[]>(initValue);
    const getOptionsDefault = () => {
        const optionParents = inputParameter?.filter((item) => item.parentUnitCode === '') || [];
        setOptions(optionParents);
        setCurrentPlaceHolder((placeholders && placeholders[0]) || '');
    };
    useEffect(() => {
        setAreaSelected(initValue);
        getOptionsDefault();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleChange = useCallback<AutocompleteOnChange>((_event, value, reason, details) => {
        if (reason === 'removeOption') {
            const removeType = details?.option.type;
            const filterAreaSelectedByType = areaSelected.filter((item) => item.type! < removeType!);
            setAreaSelected(filterAreaSelectedByType);
            if (filterAreaSelectedByType.length === 0) {
                getOptionsDefault();
            } else {
                const optionByCode =
                    inputParameter?.filter(
                        (item) => item.parentUnitCode === filterAreaSelectedByType[filterAreaSelectedByType.length - 1].code
                    ) || [];
                setOptions(optionByCode);
                setCurrentPlaceHolder((placeholders && placeholders[filterAreaSelectedByType.length]) || '');
            }
            onChange(filterAreaSelectedByType);
        } else if (reason === 'clear') {
            getOptionsDefault();
            setAreaSelected([]);
            onChange([]);
        } else {
            if (value?.length > 0) {
                const optionByCode = inputParameter?.filter((item) => item.parentUnitCode === value[value.length - 1].code) || [];
                setOptions(optionByCode);
                setAreaSelected(value);
                setCurrentPlaceHolder((placeholders && placeholders[value.length]) || '');
                onChange(value);
            } else {
                getOptionsDefault();
                onChange([]);
            }
        }
    }, []);

    return (
        <AreaSelectFieldComponent
            placeholder={currentPlaceHolder}
            label={label}
            options={options}
            areaSelected={value || areaSelected}
            onChange={handleChange}
        />
    );
};
export default AreaSelectField;
