import * as React from 'react';
import _ from 'lodash';
import SearchUser from '../SearchUser';
import EnhancedTableComponent from '../EnhancedTable';
import { Constants } from '../../../../Commons/Constant';
import { Route, Routes } from 'react-router';
import { User } from 'Features/SYSTEM/User/types';

interface UserComponentProps {
    rows: User[];
    onSubmitData?: (users: User[]) => void;
    isAcceptanced?: boolean;
}

const UserInGroupComponent: React.FC<UserComponentProps> = (props) => {
    const { rows, onSubmitData } = props;

    const handleUserDeleted = React.useCallback(
        (ids: number[], _description: string) => {
            if (ids.length > 0) {
                onSubmitData && onSubmitData(rows.filter((x) => x.id !== undefined && !ids.includes(x.id)));
            }
        },
        [onSubmitData, rows]
    );

    const handleChangeAddUser = (users: User[]) => {
        const newUsers = _.cloneDeep(rows);
        users?.map((x) => newUsers.push(x));
        onSubmitData && onSubmitData(newUsers);
    };

    return (
        <>
            <EnhancedTableComponent rows={rows} onChangeDeleted={handleUserDeleted} />
            <Routes>
                <Route
                    key={Constants.ADD_USER_TO_GROUP_PATH}
                    path={Constants.ADD_USER_TO_GROUP_PATH}
                    element={<SearchUser onChangeAddUser={handleChangeAddUser} usersSelected={rows} />}
                />
            </Routes>
        </>
    );
};
export default UserInGroupComponent;
