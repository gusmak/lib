import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router';
import PageManagement, { QueryInput } from 'AWING/PageManagement';
import Layout from '../common/Layout';
import { Autorenew, TaskAlt } from '@mui/icons-material';
import { useCallback } from 'react';

export const timestampToDate = (seconds?: string) => {
    if (!seconds) return;
    const date = new Date(Number(seconds) * 1000);
    return date.toLocaleDateString('vi-VN');
};

export type Story = StoryObj<typeof meta>;

enum PlaceStatus {
    Active = 0,
    OnPause = 1,
    Maintenance = 2,
    InActive = 3,
}

// #region Meta
const meta = {
    title: 'AWING/PageManagement',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: PageManagement,
} satisfies Meta<typeof PageManagement>;
// #endregion Meta

const Demo = () => {
    const queryData = useCallback(
        (
            queryInput: QueryInput<{
                domain?: string;
                dateRange?: [string, string];
            }>
        ) => {
            /* Nếu không truyền FieldName vào QueryInput */
            /* Nếu  truyền FieldName vào QueryInput, cần tạo ra 1 type dùng chung: VD: type FielNames = 'domain' | 'status' => rồi truyền vào QueryInput */
            console.log('queryInput', queryInput.advancedObject?.dateRange);
        },
        []
    );

    return (
        <BrowserRouter>
            <PageManagement
                title="Danh sách địa điểm"
                onChangeQueryInput={queryData}
                loading={false}
                rows={[
                    {
                        placeId: '4613707761377709686',
                        domainId: '5462480518993333800',
                        name: 'WMP_6771_WM+ VTU 117-119 Hoàng Văn Thụy  dd',
                        address:
                            '117 - 119 Hoàng Văn Thụ, Pchường 7, Thành phố Vũng Tàu, Tỉnh Bà Rịa - Vũng Tàu, Việt Nam',
                        description: 'fdsfsd',
                        longitude: 107.0871373,
                        latitude: 10.3642467,
                        communeCode: '26524',
                        districtCode: '747',
                        provinceCode: '77',
                        status: 0,
                        joinedDate: {
                            seconds: '1697702420',
                            nanos: 0,
                        },
                    },
                    {
                        placeId: '4612057606862415417',
                        domainId: '5462480518993333800',
                        name: 'WMP_6703_WM+ AGG 342 quốc lộ 910',
                        address: '342 Quốc lộ 91, Thị Trấn Cái Dầu, Huyện Châu Phú, Tỉnh An Giang, Việt Nam',
                        description: '',
                        longitude: 105.2368548,
                        latitude: 10.5753029,
                        communeCode: '30463',
                        districtCode: '889',
                        provinceCode: '89',
                        status: 0,
                        joinedDate: {
                            seconds: '1699890650',
                            nanos: 0,
                        },
                    },
                    {
                        placeId: '4612998318442989124',
                        domainId: '5462480518993333800',
                        name: 'WMP_4667_WM+ HNI Ô 5 CT1 KĐT Gelexia',
                        address:
                            'DVTM-05, Tầng 1+2, tòa CT1, KĐT Gelexia Riverside, 885 Tam Trinh, Phường Yên Sở, Q. Hoàng Mai, Thành phố Hà Nội, Việt Nam',
                        description: '',
                        longitude: 105.8688337,
                        latitude: 20.97594348,
                        communeCode: '00340',
                        districtCode: '008',
                        provinceCode: '01',
                        status: 0,
                        joinedDate: {
                            seconds: '1713340849',
                            nanos: 0,
                        },
                    },
                    {
                        placeId: '4613991316218516074',
                        domainId: '5462480518993333800',
                        name: 'WMP_2AI5_WIN HCM GF-03 & GF-05, CC Stown',
                        address:
                            'GF-03 và GF-05, Tầng trệt Chung cư STown Thủ Đức, số 2A đường Bình Chiểu, P. Bình Chiểu, Thành phố Thủ Đức, TP. Hồ Chí Minh, Việt Nam',
                        description: '',
                        longitude: 106.7330239,
                        latitude: 10.87306408,
                        communeCode: '26797',
                        districtCode: '769',
                        provinceCode: '79',
                        status: 0,
                        joinedDate: {
                            seconds: '1711126725',
                            nanos: 0,
                        },
                    },
                    {
                        placeId: '4611864748268400448',
                        domainId: '5030377451576420562',
                        name: 'TokyoDeli_HCM - 11 Nguyen Van Ba',
                        address: '11 Nguyễn Văn Bá',
                        description: '',
                        longitude: 106.768195,
                        latitude: 10.8407793,
                        communeCode: '26824',
                        districtCode: '769',
                        provinceCode: '79',
                        status: 0,
                        joinedDate: {
                            seconds: '1618502821',
                            nanos: 0,
                        },
                    },
                    {
                        placeId: '4613320429447084082',
                        domainId: '4857469430519615278',
                        name: 'HC_HNI - 23 Quan Thanh (EX) dasda',
                        address: '23 Quán Thánh, Ba Đình, Hà Nội',
                        description: null,
                        longitude: 105.844446,
                        latitude: 21.0411995,
                        communeCode: '00013',
                        districtCode: '001',
                        provinceCode: '01',
                        status: 0,
                        joinedDate: {
                            seconds: '1618423045',
                            nanos: 0,
                        },
                    },
                    {
                        placeId: '4612577671677689572',
                        domainId: '4857469430519615278',
                        name: 'HC_HN - Ecohome 3 (EX)',
                        address: '100 Tân Xuân',
                        description: '',
                        longitude: 105.7854871,
                        latitude: 21.0893902,
                        communeCode: '00601',
                        districtCode: '021',
                        provinceCode: '01',
                        status: 0,
                        joinedDate: {
                            seconds: '1636058269',
                            nanos: 0,
                        },
                    },
                    {
                        placeId: '4613124139963382736',
                        domainId: '4857469430519615278',
                        name: 'HC_DNG - 9 Dang Thuy Tram (EX) ',
                        address: 'Đặng Thùy Trâm, Hòa Thuận Tây, Hải Châu, Đà Nẵng 550000',
                        description: null,
                        longitude: 108.2087222,
                        latitude: 16.0524302,
                        communeCode: '20245',
                        districtCode: '492',
                        provinceCode: '48',
                        status: 0,
                        joinedDate: {
                            seconds: '1672531200',
                            nanos: 0,
                        },
                    },
                    {
                        placeId: '4612088555142300004',
                        domainId: '5023173597424371233',
                        name: 'GGG_Gogi_CT -Vincom Cần Thơ',
                        address: 'GoGi House Vincom Hùng Vương Cần Thơ, 2 Hùng Vương Ninh Kiều',
                        description: '',
                        longitude: 105.7794857,
                        latitude: 10.0454948,
                        communeCode: '31144',
                        districtCode: '916',
                        provinceCode: '92',
                        status: 0,
                        joinedDate: {
                            seconds: '1672531200',
                            nanos: 0,
                        },
                    },
                    {
                        placeId: '4614070236986914067',
                        domainId: '5538742900884010760',
                        name: 'CK_HN_HN2093 - 49 Hàng Chuối',
                        address: '49 Hàng Chuối, Phạm Đình Hổ, Hai Bà Trưng, Hà Nội',
                        description: null,
                        longitude: 105.8579515,
                        latitude: 21.0161859,
                        communeCode: '00247',
                        districtCode: '007',
                        provinceCode: '01',
                        status: 0,
                        joinedDate: {
                            seconds: '1672531200',
                            nanos: 0,
                        },
                    },
                ]}
                columns={[
                    {
                        field: 'id',
                        headerName: '#',
                        width: 60,
                        // valueGetter: (row, idx, stt) => row.,
                    },
                    {
                        field: 'placeId',
                        headerName: 'ID',
                        width: 200,
                    },
                    {
                        field: 'name',
                        headerName: 'Tên',
                    },
                    {
                        field: 'domainId',
                        headerName: 'Domain',
                    },
                    {
                        field: 'status',
                        headerName: 'Trạng thái',
                        TableCellProps: {
                            sx: {
                                paddingBlock: 0,
                            },
                        },
                    },
                    {
                        field: 'joinedDate',
                        headerName: 'Ngày join',
                        valueGetter: (row: any) => timestampToDate(row?.joinedDate?.seconds),
                    },
                ]}
                onCreateButtonClick={() => {}}
                onCreateFolderButtonClick={() => {}}
                advancedSearchFields={[
                    {
                        fieldName: 'domain',
                        label: 'Domain',
                        type: 'autocomplete',
                        icon: <TaskAlt fontSize="small" />,
                        options: [{ name: 'AWING HEAD', domainId: '5435' }].map((domain, idx) => ({
                            text: domain.name!,
                            value: domain.domainId!,
                        })),
                        defaultValue: { text: 'AWING HEAD', value: '5435' },
                    },
                    {
                        fieldName: 'status',
                        label: 'Trạng thái',
                        type: 'autocomplete',
                        icon: <Autorenew fontSize="small" />,
                        options: Object.values(PlaceStatus)
                            .filter((item) => isNaN(Number(item)))
                            .map((key, idx) => ({
                                text: 'Đang hoạt động',
                                value: String(idx),
                                // key,
                            })),
                    },
                    {
                        fieldName: 'dateRange',
                        label: 'Thời gian',
                        type: 'date-range',
                        isShowCalendarInfo: true,
                    },
                ]}
                totalOfRows={20}
                onDelete={() =>
                    new Promise((resolve) => {
                        resolve(console.log('ABC'));
                    })
                }
            />
        </BrowserRouter>
    );
};

export const Simple: Story = {
    args: {
        title: 'Danh sách địa điểm',
        columns: [],
        rows: [],
        advancedSearchFields: [],
        onCreateButtonClick: () => {},
        onCreateFolderButtonClick: () => {},
        loading: false,
        onChangeQueryInput: () => {},
    },
    render: () => {
        return (
            <Layout>
                <Demo />
            </Layout>
        );
    },
};

export default meta;
