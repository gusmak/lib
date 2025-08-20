import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    type TextFieldProps,
} from '@mui/material';
import { textValidation } from 'AWING/ultis/validation';

export interface EnhancedDialogProps {
    title?: string;
    label?: string;
    content?: ReactNode;
    isOpen: boolean;
    confirmExit?: boolean;
    notIncludeInput?: boolean;
    onSubmit?: (text: string) => void;
    onClose?: () => void;
    textFieldProps?: TextFieldProps;
}

const EnhancedDialog = (props: EnhancedDialogProps) => {
    const { t } = useTranslation();
    const { title, content, isOpen, notIncludeInput, onSubmit, onClose, textFieldProps } = props;

    const [text, setText] = useState('');
    const [checkValid, setValid] = useState<ReturnType<typeof textValidation>>({
        valid: true,
        message: '',
    });

    useEffect(() => {
        setText('');
    }, [isOpen]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (onSubmit) onSubmit(text);
    };

    const handleClose = () => {
        if (onClose) onClose();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm"
            fullWidth={true}
        >
            <DialogTitle id="alert-dialog-title">{title ?? t('Dialog.Title')}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ marginBottom: (theme) => theme.spacing(1.5) }}>
                    {content ?? t('Dialog.Content')}
                </DialogContentText>
                {!notIncludeInput && (
                    <TextField
                        autoFocus
                        margin="dense"
                        label={props.label}
                        rows={2}
                        multiline
                        type="text"
                        name="text"
                        value={text}
                        onChange={(e) => {
                            setText(e.target?.value);
                            setValid(textValidation(e.target?.value, 50, true, false));
                        }}
                        fullWidth
                        onKeyDown={handleKeyDown}
                        error={!checkValid.valid}
                        helperText={!checkValid.valid ? checkValid.message : ''}
                        {...textFieldProps}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    {t('Common.Cancel')}
                </Button>
                <Button disabled={!(!notIncludeInput && checkValid.valid)} onClick={() => handleSubmit()} color="primary">
                    {t('Common.Agree')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EnhancedDialog;
