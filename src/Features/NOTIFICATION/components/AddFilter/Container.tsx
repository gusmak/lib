import { Constants } from 'Commons/Constant';
import { useAtom } from 'jotai';
import { cloneDeep, assign } from 'lodash';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import EnhancedTableComponent from '../ConfigNotification/TableFilter';
import { FilterObjectState } from 'Features/NOTIFICATION/NotificationConfig/jotai';
import { Detail } from '../ConfigNotification/type';
import ConfigFilter from '../ConfigNotification/ConfigFilter';
import { IAddFilter, LastPointType } from './types';

const AddFilter = ({
    notificationConfigDetails,
    users,
    groups,
    templates,
    loading,
    objectFilters,
    onSubmitData,
    onValid,
    onClickTesting,
    notificationConfigDetailPermissions,
}: IAddFilter) => {

    const [filterObjectId, setFilterObjectId] = useAtom(FilterObjectState);

    useEffect(() => {
        onValid(
            notificationConfigDetails?.length > 0 &&
                notificationConfigDetails?.every((detail) => {
                    return (
                        !!detail.objectFilterId &&
                        detail.channels?.length > 0 &&
                        detail.channels?.every((channel) => {
                            return (
                                channel.lastPoints?.length > 0 &&
                                channel.lastPoints?.every((lastPoint) => {
                                    let receiverValid = false;
                                    switch (lastPoint.type) {
                                        case LastPointType.EMAIL:
                                            receiverValid = !!lastPoint.email;
                                            break;
                                        case LastPointType.TELEGRAM:
                                            receiverValid = !!lastPoint.receiverId;
                                            break;
                                        case LastPointType.USER_IDS:
                                            receiverValid = (lastPoint.userIds?.length || 0) > 0;
                                            break;
                                        case LastPointType.USER_GROUP_IDS:
                                            receiverValid = (lastPoint.userGroupIds?.length || 0) > 0;
                                            break;
                                    }
                                    return receiverValid && !!lastPoint.templateId;
                                })
                            );
                        })
                    );
                })
        );
    }, [notificationConfigDetails]);

    const handleChangeAddFilter = (filters: Detail) => {
        const newFilters: Detail[] = cloneDeep(notificationConfigDetails);

        if (filterObjectId) {
            const existingFilter = newFilters.find((item) => item.objectFilterId === filterObjectId);

            if (existingFilter) {
                assign(existingFilter, filters);
                setFilterObjectId(undefined);
            }
        } else {
            newFilters.push(filters);
        }

        if (onSubmitData) {
            onSubmitData(newFilters);
        }
    };

    return (
        <>
            <EnhancedTableComponent
                notificationConfigDetails={notificationConfigDetails}
                users={users}
                groups={groups}
                templates={templates}
                loading={loading}
                objectFilters={objectFilters}
                onSubmitData={onSubmitData}
                onClickTesting={onClickTesting}
                notificationConfigDetailPermissions={notificationConfigDetailPermissions}
            />
            <Routes>
                <Route
                    key={Constants.CONFIG_FILTER}
                    path={Constants.CONFIG_FILTER}
                    element={
                        <ConfigFilter
                            onChangeAddFilter={handleChangeAddFilter}
                            objectFilters={objectFilters}
                            users={users}
                            groups={groups}
                            templates={templates}
                            notificationConfigDetails={notificationConfigDetails}
                            notificationConfigDetailPermissions={notificationConfigDetailPermissions}
                        />
                    }
                />
            </Routes>
        </>
    );
};

export default AddFilter;
