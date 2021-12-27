import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  Space,
  Spin,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useApi } from '../../../api';
import { GatewayDto } from '../../../model/gateway.dto';

const { Option } = Select;

const initialGateway: GatewayDto = {
  serialNumber: '',
  name: '',
  ipV4Address: '',
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
  data: GatewayDto;
}

const GatewayForm: FC<Props> = (props) => {
  const formRef = useRef();
  const { visible, id, onClose, fetchGateways } = props
  const [state, setState] = useState<State>({
    fetching: false,
    data: initialGateway
  });

  const { getGatewayById, createGateway, updateGateway } = useApi();

  const { data, fetching } = state;

  const fetchGateway = useCallback(async () => {
    setState((oldState) => ({ ...oldState, fetching: true }));
    try {
      const response = await getGatewayById(id || '');
      setState({
        fetching: false,
        data: response.data,
      });
    } catch (e: any) {
      if (e.message) {
        openNotification(e.message)
      }
      setState({
        fetching: false,
        data: initialGateway,
      });
    }
  }, [getGatewayById, id]);

  const apiAction = useCallback(() => {
    return id ? updateGateway(id, data) : createGateway(data)
  }, [createGateway, data, id, updateGateway])

  const saveGateway = useCallback(async () => {
    try {
      setState((oldState) => ({ ...oldState, fetching: true }));
      await apiAction();
      setState({
        fetching: false,
        data: initialGateway,
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
  }, [apiAction, data, fetchGateways, onClose]);

  useEffect(() => {
    if (id) {
      fetchGateway()
    }
  }, [fetchGateway, id])

  const handleOnValuesChange = (_: any, allValues: GatewayDto) => {
    setState((oldState) => ({ ...oldState, data: { ...data, ...allValues } }));
  }

  const handleOnClose = () => {
    setState({
      fetching: false,
      data: initialGateway,
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

  const title = id ? 'Edit Gateway' : 'Create a Gateway'

  return (
    <Drawer
      title={title}
      width={720}
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
        : <Form  ref={formRef as any} layout="vertical" onValuesChange={handleOnValuesChange} initialValues={data}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="serialNumber"
                label="Serial Number"
                rules={[{ required: true, message: 'Please enter serial number' }]}
              >
                <Input disabled={!!id} placeholder="Please enter serial number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Name"
              >
                <Input
                  style={{ width: '100%' }}
                  placeholder="Please enter gateway name"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="ipV4Address"
                label="IP Address"
                rules={[{
                  pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                  message: 'Must match the ip v4 address format.'
                }]}
              >
                <Input placeholder="Please enter an IP Address" />
              </Form.Item>
            </Col>
          </Row>
          <Form.List name="devices">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'uid']}
                      fieldKey={[fieldKey, 'uid']}
                      rules={[{ required: true, message: 'Missing uid' }]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder="UID" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'vendor']}
                      fieldKey={[fieldKey, 'vendor']}
                    >
                      <Input placeholder="Vendor" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'status']}
                      fieldKey={[fieldKey, 'status']}
                    >
                      <Select style={{ width: '100%' }} placeholder="Status">
                        <Option value="online">Online</Option>
                        <Option value="offline">Offline</Option>
                      </Select>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button disabled={fields.length > 9} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add device
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      }
    </Drawer>
  )
}

export default GatewayForm;
