import { FC, useCallback, useState } from 'react';
import { Button, Col, Drawer, Form, Input, notification, Row, Select, Spin } from 'antd';
import { useApi } from '../../../api';
import { DeviceDto, DeviceStatus } from '../../../model/gateway.dto';

const { Option } = Select;

interface FormData {
  uid?: string;
  vendor?: string;
  status: DeviceStatus;
}

const initialDevice: FormData = {
  uid: undefined,
  status: DeviceStatus.OFFLINE,
}

const openNotification = (message: string) => {
  notification.error({
    message: 'Error',
    description: message,
  });
};

interface Props {
  visible: boolean;
  id?: string;
  onClose: () => void;
  fetchGateways: () => void;
}

interface State {
  fetching: boolean;
  data: FormData;
  device?: DeviceDto;
}

const DeviceForm: FC<Props> = (props) => {
  const { visible, id, onClose, fetchGateways } = props
  const [state, setState] = useState<State>({
    fetching: false,
    data: initialDevice,
  });

  const { addGatewayDevice } = useApi();

  const { data, fetching, device } = state;

  const addDevice = useCallback(() => {
    if (data.uid) {
      const payload: DeviceDto = {
        ...device,
        uid: parseInt(data.uid),
        vendor: data?.vendor,
        status: data?.status,
      }
      return addGatewayDevice(id, payload)
    }

  }, [addGatewayDevice, data?.status, data.uid, data?.vendor, device, id])

  const saveGateway = useCallback(async () => {
    setState((oldState) => ({ ...oldState, fetching: true }));
    try {
      await addDevice();
      setState({
        fetching: false,
        data: initialDevice,
      });
      onClose()
      fetchGateways()
    } catch (e: any) {
      if (e.message) {
        openNotification(e.message)
      }
      setState({
        fetching: false,
        data,
      });
    }
  }, [addDevice, data, fetchGateways, onClose]);

  const handleOnValuesChange = (_: any, allValues: FormData) => {
    const reg = /^-?\d*(\.\d*)?$/;
    let uid = allValues?.uid;
    const isValidUid = (uid && !isNaN(parseInt(uid)) && reg.test(uid)) || uid === '' || uid === '-'
    setState((oldState) => ({
      ...oldState,
      data: {
        ...data,
        ...allValues,
        uid: isValidUid ? uid : '',
      }
    }));
  }

  const handleOnClose = () => {
    setState({
      fetching: false,
      data: initialDevice,
    });
    onClose();
  };

  const footer = (
    <div>
      <Button onClick={handleOnClose} style={{ marginRight: 8 }}>
        Cancel
      </Button>
      <Button onClick={saveGateway} type="primary">
        Submit
      </Button>
    </div>
  )

  return (
    <Drawer
      title="Add a Device"
      onClose={handleOnClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={footer}
      destroyOnClose
    >
      {fetching
        ? <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
            <Spin size="large" />
          </div>
        : <Form layout="vertical" onValuesChange={handleOnValuesChange} initialValues={data}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="uid"
                label="UID"
                rules={[{ required: true, message: 'Please enter uid' }]}
              >
                <Input placeholder="Please enter uid" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="vendor"
                label="Vendor"
              >
                <Input
                  style={{ width: '100%' }}
                  placeholder="Please enter a vendor"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="status"
                label="Status"
              >
                <Select style={{ width: '100%' }} placeholder="Please select a status">
                  <Option value="online">Online</Option>
                  <Option value="offline">Offline</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      }
    </Drawer>
  )
}

export default DeviceForm;
