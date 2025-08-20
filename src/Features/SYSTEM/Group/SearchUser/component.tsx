import { ChangeEvent, useState } from 'react';
import { filter, some } from 'lodash';
import { FormControlLabel, Checkbox, Paper } from '@mui/material';
import { NoData, SearchBox } from '../../../../AWING';
import Grid from '@mui/material/Grid';
import { User } from 'Features/SYSTEM/User/types';

interface SearchUserGroupUserProps {
    listUserId: number[];
    onListUserIdChange: (listUserId: number[]) => void;
    users: User[];
}

function SearchUserGroupUser(props: SearchUserGroupUserProps) {
    const { listUserId, onListUserIdChange, users } = props;

    const [usersSearchResult, setUsersSearchResult] = useState<Partial<User>[]>([]);

    const [keyWordSearch, setKeyWordSearch] = useState<string>('');

    const handleFilterByFieldName = (list: Partial<User>[], newSearchString: string, fieldName: string) => {
        let result = [];
        if (newSearchString !== '') {
            result =
                list?.filter((item) => {
                    return (item[fieldName as keyof User] as string).toLowerCase().indexOf(newSearchString.toLowerCase()) !== -1;
                }) || [];
        } else return list;
        return result;
    };

    const handleChangeUserList = (userId: number, e: ChangeEvent<HTMLInputElement>) => {
        let newUserIds = listUserId.slice();
        if (e.target.checked) {
            onListUserIdChange([...newUserIds, userId]);
        } else {
            newUserIds = filter(newUserIds, (id) => id !== userId);
            onListUserIdChange(newUserIds);
        }
    };

    const handleSearch = (searchString: string) => {
        setKeyWordSearch(searchString);
        const newUsersSearchResult = handleFilterByFieldName(users, searchString, 'username');
        setUsersSearchResult(newUsersSearchResult);
    };

    return (
        <Paper
            sx={(theme) => ({
                padding: (theme) => theme.spacing(3),
                border: theme.palette.background.paper,
            })}
        >
            <SearchBox
                style={{
                    height: '40px',
                    width: '100%',
                }}
                onSearch={(_searchType: string, searchString: string) => {
                    handleSearch(searchString);
                }}
            />
            {usersSearchResult && usersSearchResult?.length > 0 ? (
                <Grid
                    container
                    sx={{
                        mt: 3,
                    }}
                >
                    {usersSearchResult?.map((user, key: number) => (
                        <Grid key={key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={some(listUserId, (id) => id === user.id)}
                                        onChange={(e) => user.id !== undefined && handleChangeUserList(user.id, e)}
                                        value={user.id}
                                    />
                                }
                                label={user.username}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <>{keyWordSearch ? <NoData /> : null}</>
            )}
        </Paper>
    );
}

export default SearchUserGroupUser;
