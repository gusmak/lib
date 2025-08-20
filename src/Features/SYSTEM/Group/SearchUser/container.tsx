import { useState, useEffect } from 'react';
import _ from 'lodash';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import SearchUserGroupUser from './component';
import { ClassicDrawer } from '../../../../Commons';
import { CircularProgress } from '../../../../AWING';
import { useContextGroup } from '../context';
import { User } from 'Features/SYSTEM/User/types';

interface AddUserProps {
    usersSelected: User[];
    onChangeAddUser?: (users: User[]) => void;
}

const AddUser = (props: AddUserProps) => {
    const { t } = useTranslation();
    const { usersSelected, onChangeAddUser = () => null } = props;

    const [listUserId, setListUserId] = useState<number[]>([]);

    const [usersData, setUsersData] = useState<User[]>([]);

    const [loading, setLoading] = useState(false);

    const { services } = useContextGroup();

    useEffect(() => {
        setListUserId(usersSelected.length > 0 ? usersSelected.map((item) => item.id).filter((id): id is number => id !== undefined) : []);
    }, [usersSelected]);

    const handleListUserIdChange = (newListUserId: number[]) => {
        setListUserId(newListUserId);
    };

    const handleSubmitUser = (userIds: number[]) => {
        const newUserIds = _.differenceWith(userIds, usersSelected, (a, b) => a === b.id);
        const newUsers = [
            ...newUserIds.map((userId) => {
                const user = usersData?.find((user) => user?.id === userId);
                return {
                    id: userId,
                    username: user?.username ?? '',
                    name: user?.name ?? '',
                };
            }),
        ];
        onChangeAddUser(newUsers);
    };

    useEffect(() => {
        if (services?.getUsers) {
            setLoading(true);
            services
                .getUsers()
                .then((data) => {
                    setUsersData(data.users);
                })
                .finally(() => setLoading(false));
        }
    }, []);

    return (
        <ClassicDrawer
            title={t('UserGroup.TitleAdd')}
            onSubmit={() => {
                return new Promise((resolve, _reject) => {
                    handleSubmitUser(listUserId);
                    resolve(true);
                });
            }}
        >
            <Grid sx={{ flexGrow: 1, pt: 3, pb: 3, pl: 1, pr: 1 }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <SearchUserGroupUser
                        users={
                            usersData
                                ?.filter((x): x is NonNullable<typeof x> => x !== null)
                                .filter((x) => !usersSelected?.map((y) => y.id).includes(x.id)) ?? []
                        }
                        listUserId={listUserId}
                        onListUserIdChange={handleListUserIdChange}
                    />
                )}
            </Grid>
        </ClassicDrawer>
    );
};

export default AddUser;
