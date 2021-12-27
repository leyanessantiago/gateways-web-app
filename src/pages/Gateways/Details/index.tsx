import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Descriptions, Typography, Popconfirm, Row, Space, Table, Divider } from 'antd';
import { PlusOutlined, EditOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useApi } from '../../../api';
import GatewayForm from '../Form';
import DeviceForm from '../Form/DeviceForm';
import { DeviceDto, GatewayDto } from '../../../model/gateway.dto';
import createdAtTemplate from '../List/templates/created-at-template';
import DevicesActionsTemplate from './devices-actions-template';

const { Title } = Typography;

const initialGateway: GatewayDto = {
  serialNumber: '',
  name: '',
  ipV4Address: '',
}

interface State {
  fetching: boolean;
  data: GatewayDto;
}

interface ShowGatewayFormState {
  visible: boolean,
  id?: string,
}

interface ShowDeviceFormState {
  visible: boolean,
  id?: string,
  uid?: number,
}

const GatewaysDetails: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams()
  const [state, setState] = useState<State>({
    fetching: false,
    data: initialGateway,
  });
  const { getGatewayById, deleteGateway, removeGatewayDevice } = useApi();

  const [showGatewayForm, setShowGatewayForm] = useState<ShowGatewayFormState>({
    visible: false,
    id: undefined,
  });

  const [showDeviceForm, setShowDeviceForm] = useState<ShowDeviceFormState>({
    visible: false,
    id: undefined,
    uid: undefined,
  });

  const openEditGatewayForm = () => {
    setShowGatewayForm({ visible: true, id  });
  };

  const handleCloseGatewayForm = () => {
    setShowGatewayForm({visible: false, id: undefined});
  };

  const openAddDeviceForm = () => {
    setShowDeviceForm({visible: true, id, uid: undefined});
  };

  const handleCloseDeviceForm = () => {
    setShowDeviceForm({visible: false, id: undefined, uid: undefined});
  };

  const {data} = state;

  const fetchGateway = useCallback(async () => {
    setState((oldState) => ({ ...oldState, fetching: true }));
    try {
      const response = await getGatewayById(id || '');
      setState({
        fetching: false,
        data: response.data,
      });
    } catch (e) {
      setState({
        fetching: false,
        data: initialGateway,
      });
    }
  }, [getGatewayById, id]);

  useEffect(() => {
    fetchGateway()
  }, [fetchGateway])

  const handleOnDelete = () => {
    deleteGateway(id || '').then(() => {
      navigate('/');
    }).catch((err) => {
      console.error(err);
    });
  };

  const handleOnDeleteDevice = (uid: number) => {
    removeGatewayDevice(id, uid).then(() => {
      fetchGateway()
    }).catch((err) => {
      console.error(err);
    });
  };

  const handleDevicesActionsTemplate = (_: any, device: DeviceDto) => {
    return DevicesActionsTemplate({ uid: device.uid, handleOnDeleteDevice });
  }


  return (
    <>
      <Row>
        <Space style={{marginBottom: '24px'}}>
          <Button type="primary" onClick={openEditGatewayForm}>
            <EditOutlined /> Edit
          </Button>
          <Button type="primary" onClick={openAddDeviceForm}>
            <PlusOutlined /> Add Device
          </Button>
          <Popconfirm title="Sure to delete?" onConfirm={handleOnDelete}>
            <Button type="primary">
              <MinusCircleOutlined /> Delete
            </Button>
          </Popconfirm>
        </Space>
      </Row>
      <Descriptions title="Gateway Info">
        <Descriptions.Item label="Serial Number">{data._id}</Descriptions.Item>
        <Descriptions.Item label="Name">{data.name}</Descriptions.Item>
        <Descriptions.Item label="IP Address">{data.ipV4Address}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Title level={2}>Devices</Title>
      <Table dataSource={data.devices} bordered pagination={false} rowKey="_id">
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
      <GatewayForm
        visible={showGatewayForm.visible}
        id={showGatewayForm.id}
        onClose={handleCloseGatewayForm}
        fetchGateways={fetchGateway}
      />
      <DeviceForm
        visible={showDeviceForm.visible}
        id={showDeviceForm.id}
        onClose={handleCloseDeviceForm}
        fetchGateways={fetchGateway}
      />
    </>
  );
}

export default GatewaysDetails;
