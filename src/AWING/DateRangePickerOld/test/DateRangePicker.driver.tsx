export type Driver = {
    inputmask: string;
    inputmaskInput: string;
    inputmaskButton: string;
    popper: string;
};

export function getDriver(): Driver {
    const inputmask = '[data-testid="date-range-picker-inputmask"]';
    const inputmaskInput = '[data-testid="date-range-picker-inputmask"] input';
    const inputmaskButton = '[data-testid="date-range-picker-inputmask"] button';
    const popper = '[data-testid="date-range-picker-popper"]';

    return {
        inputmask,
        inputmaskInput,
        inputmaskButton,
        popper,
    };
}

export const driver = getDriver();
