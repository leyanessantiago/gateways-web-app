import { FC } from 'react';
import { Table } from 'antd';
import createdAtTemplate from './templates/created-at-template';
import devicesActionsTemplates from './templates/devices-actions-template';
import { DeviceDto } from '../../../model/gateway.dto';

interface Props {
  gatewayId: string;
  data: DeviceDto[];
  fetchGateways: () => void;
}

const DevicesList: FC<Props> = (props) => {
    const { gatewayId, data, fetchGateways } = props;
    const handleDevicesActionsTemplate = (_: any, device: DeviceDto) => {
        const params = { id: gatewayId, uid: device.uid };
        return devicesActionsTemplates({ params, fetchGateways });
    }

    return (
        <Table dataSource={data} bordered pagination={false} rowKey="_id">
            <Table.Column key="uid" title="UID" dataIndex="uid" />
            <Table.Column key="vendor" title="Vendor" dataIndex="vendor" />
            <Table.Column
                key="createdAt"
                title="Created At"
                dataIndex="createdAt"
                render={createdAtTemplate}
            />
            <Table.Column key="status" title="Status" dataIndex="status" />
            <Table.Column
                key="action"
                title="Action"
                dataIndex="action"
                render={handleDevicesActionsTemplate}
            />
        </Table>
    );
}

export default DevicesList;
