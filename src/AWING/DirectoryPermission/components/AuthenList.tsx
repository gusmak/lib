import { type ChangeEvent } from 'react';
import { Grid, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { Authen } from '../types';

export type OwnProps = {
    authens: Authen[];
    title: string;
    selectedAuthenIds: number[];
    onChangeAuthenIds: (newAuthenIds: Authen['id'][], type: string) => void;
};

function AuthenList(props: OwnProps) {
    const { authens, title, selectedAuthenIds, onChangeAuthenIds } = props;

    const handleChangeAuthenList = (id: number, type: string, e: ChangeEvent<HTMLInputElement>) => {
        let newAuthenIds = selectedAuthenIds.slice();
        if (e.target?.checked) newAuthenIds = [...newAuthenIds, id];
        else newAuthenIds = newAuthenIds.filter((authenId) => authenId !== id);

        onChangeAuthenIds(newAuthenIds, type);
    };

    return authens.length > 0 ? (
        <Grid container sx={{ marginTop: 4 }} data-testid="authen-list-root">
            <Grid size={{ xs: 12 }}>
                <Typography sx={{ fontWeight: 700 }} data-testid="header-title">
                    {title} ({authens.length})
                </Typography>
            </Grid>

            {authens.map((authen, key) => (
                <Grid key={key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={selectedAuthenIds.some((id) => id === authen.id)}
                                onChange={(event) => handleChangeAuthenList(authen.id, authen.type, event)}
                                value={authen.id}
                            />
                        }
                        label={authen.name}
                    />
                </Grid>
            ))}
        </Grid>
    ) : null;
}

export default AuthenList;
