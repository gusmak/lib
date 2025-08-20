import { useState, useCallback, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Constants } from 'Commons/Constant';
import { useGetContext } from '../Context';
import { NotificationMessageStatus } from '../Enum';
import HeaderInfo from './HeaderInfo';
import NotificationList from './NotificationList';
import type { IValueItem, IValueFilterState, NotificationMessage } from '../Types';

interface NotificationDetailProps {
    onClosePopover?: () => void;
}

const NotificationDetail = (props: NotificationDetailProps) => {
    const { service } = useGetContext();
    const { onClosePopover } = props;

    const [valueFilter, setValueFilter] = useState<IValueFilterState>({
        textSearch: '',
        tabs: Constants.ALL,
        status: Constants.ALL_STATUS,
    });

    const [isLoading, setIsLoading] = useState(false);

    const [count, setCount] = useState<number>(0);
    const [isInViewPort, setIsInViewPort] = useState<boolean>(true);
    const [notificationMessage, setNotificationMessage] = useState<NotificationMessage[]>([]);

    const totalItemCount = useRef<number>(0);

    useEffect(() => {
        let observer = new IntersectionObserver((entries) => {
            entries.map((entry) => entry.isIntersecting).forEach(setIsInViewPort);
        });
        const lastItem = document.getElementById('last-Item');
        if (observer && lastItem) {
            setIsLoading(true);
            observer.observe(lastItem);
        }
        return () => {
            if (observer) {
                observer.disconnect();
                observer = null as any;
            }
        };
    }, []);

    useEffect(() => {
        setIsLoading(true);
        service
            ?.notificationsPaging(count, Constants.PAGE_SIZE_DEFAULT, valueFilter.textSearch, valueFilter.status)
            .then((res) => {
                setNotificationMessage((prevMessages) => {
                    const newItems = res.items?.filter((newItem) => !prevMessages.some((prevItem) => prevItem.id === newItem.id));
                    return [...prevMessages, ...(newItems ?? [])];
                });
                totalItemCount.current = res.totalItemCount!;
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [count, valueFilter.textSearch, valueFilter.status]);

    useEffect(() => {
        if (isInViewPort && notificationMessage.length < totalItemCount.current && !isLoading) {
            setCount((old) => old + 1);
        }
    }, [isInViewPort]);

    const handleValueFilter = (textSearch: string, tabs: string) => {
        setNotificationMessage([]);
        setCount(0);
        totalItemCount.current = 0;
        setValueFilter({
            textSearch,
            tabs,
            status: tabs === Constants.ALL ? Constants.ALL_STATUS : Constants.UNREAD_STATUS,
        });
    };

    const handleUpdateStatus = useCallback(
        (dataSent: IValueItem | string) => {
            if (typeof dataSent === 'string') {
                const isCheckStatus = notificationMessage.some(
                    (item: NotificationMessage) => item.status === NotificationMessageStatus.Unread
                );

                if (isCheckStatus) {
                    service?.notificationsReadAll().then(() => {
                        setNotificationMessage(
                            (prevNotifications: NotificationMessage[]) =>
                                prevNotifications.map((item: NotificationMessage) => ({
                                    ...item,
                                    status: NotificationMessageStatus.Read,
                                })) as NotificationMessage[]
                        );
                    });
                }
            } else {
                const handleUpdateStatusItem = () => {
                    setNotificationMessage(
                        (prevNotifications: NotificationMessage[]) =>
                            prevNotifications.map((item: NotificationMessage) => ({
                                ...item,
                                status:
                                    item.id === dataSent.id
                                        ? item.status === NotificationMessageStatus.Read
                                            ? NotificationMessageStatus.Unread
                                            : NotificationMessageStatus.Read
                                        : item.status,
                            })) as NotificationMessage[]
                    );
                };

                dataSent.status === NotificationMessageStatus.Unread
                    ? service?.notificationsRead([dataSent.id]).then(() => {
                          handleUpdateStatusItem();
                      })
                    : service?.notificationsUnread([dataSent.id]).then(() => {
                          handleUpdateStatusItem();
                      });
            }
        },
        [notificationMessage, service]
    );

    return (
        <>
            <Box pt={2} pl={2} pr={2} pb={1} component="div">
                <HeaderInfo
                    valueFilter={valueFilter}
                    onClosePopover={onClosePopover}
                    onValueFilter={handleValueFilter}
                    onUpdateStatus={handleUpdateStatus}
                />
            </Box>
            <Box pl={1} pr={1} pb={1} component="div">
                <NotificationList
                    isLoading={isLoading}
                    valueFilter={valueFilter}
                    notificationMessage={notificationMessage}
                    onUpdateStatus={handleUpdateStatus}
                />
            </Box>
            <Box id="last-Item" component="div" sx={{ height: '20px' }} />
        </>
    );
};

export default NotificationDetail;
