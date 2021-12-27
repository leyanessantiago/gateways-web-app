import { useCallback, useEffect, useState, FC } from 'react';
import { Button, Col, Row, Table, TablePaginationConfig } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useApi } from '../../../api';
import DevicesList from './DevicesList';
import gatewaysActionsTemplates from './templates/gateways-actions-template';
import GatewayForm from '../Form';
import DeviceForm from '../Form/DeviceForm';
import GatewaysSerialNumberTemplate from './templates/gateways-serial-number-template';
import { GatewayDto } from '../../../model/gateway.dto';

interface ShowGatewayFormState {
  visible: boolean,
  id?: string,
}

interface ShowDeviceFormState {
  visible: boolean,
  id?: string,
  uid?: number,
}

interface State {
  fetching: boolean,
  data: GatewayDto[],
  count?: number,
}

const showPaginationTotal = (total: number, range: number[]) => `${range[0]}-${range[1]} of ${total} items`;

const limit = 10;

const GatewaysList: FC = () => {
  const [page, setPage] = useState<number>(1);
  const [state, setState] = useState<State>({
    fetching: false,
    data: [],
  });
  const { getGateways } = useApi();

  const handleOnchange = (pagination: TablePaginationConfig) => {
    const { current } = pagination;
    setPage(current || 1)
  };

  const [showGatewayForm, setShowGatewayForm] = useState<ShowGatewayFormState>({ visible: false });

  const [showDeviceForm, setShowDeviceForm] = useState<ShowDeviceFormState>({ visible: false });

  const openCreateGatewayForm = () => {
    setShowGatewayForm({visible: true, id: undefined});
  };

  const openEditGatewayForm = (id: string) => {
    setShowGatewayForm({ visible: true, id  });
  };

  const handleCloseGatewayForm = () => {
    setShowGatewayForm({visible: false, id: undefined});
  };

  const openAddDeviceForm = (id: string) => {
    setShowDeviceForm({visible: true, id, uid: undefined});
  };

  const handleCloseDeviceForm = () => {
    setShowDeviceForm({visible: false, id: undefined, uid: undefined});
  };

  const { fetching, data, count} = state;

  const fetchGateways = useCallback(async (_page= 1) => {
    setPage(_page)
    setState((oldState) => ({ ...oldState, fetching: true }));
    try {
      const response = await getGateways({page: _page, limit});
      setState({
        fetching: false,
        data: response.data.results,
        count: response.data.count,
      });
    } catch (e) {
      setState({
        fetching: false,
        data: [],
        count: undefined,
      });
    }
  }, [getGateways]);

  useEffect(() => {
    fetchGateways(page)
  }, [fetchGateways, page])

  const handleGatewaysActionsTemplate = useCallback((_, gateway: GatewayDto) => {
    return gatewaysActionsTemplates({
      showForm: openEditGatewayForm,
      showAddDevice: openAddDeviceForm,
      id: gateway._id || '',
      fetchGateways,
    })
  }, [fetchGateways])

  const paginationOptions = {
    total: count,
    showTotal: showPaginationTotal,
    current: page,
    showSizeChanger: false,
    pageSize: limit,
  };

  const DevicesTable = (data: GatewayDto) => {
    return (
      <DevicesList
        gatewayId={data._id || ''}
        data={data.devices || []}
        fetchGateways={fetchGateways}
      />
    )
  }

  return (
    <>
      <Row style={{marginBottom: '24px'}}>
        <Col>
          <Button type="primary" onClick={openCreateGatewayForm}>
            <PlusOutlined /> New Gateway
          </Button>
        </Col>
      </Row>
      <Table
        dataSource={data}
        loading={fetching}
        pagination={paginationOptions}
        bordered
        expandable={{ expandedRowRender: DevicesTable }}
        onChange={handleOnchange}
        rowKey="_id"
      >
        <Table.Column
          key="serialNumber"
          title="Serial Number"
          dataIndex="serialNumber"
          render={GatewaysSerialNumberTemplate}
        />
        <Table.Column key="name" title="Name" dataIndex="name" />
        <Table.Column key="ipV4Address" title="IP Address" dataIndex="ipV4Address" />
        <Table.Column
          key="action"
          title="Action"
          dataIndex="action"
          render={handleGatewaysActionsTemplate}
        />
      </Table>
      <GatewayForm
        visible={showGatewayForm.visible}
        id={showGatewayForm.id}
        onClose={handleCloseGatewayForm}
        fetchGateways={fetchGateways}
      />
      <DeviceForm
        visible={showDeviceForm.visible}
        id={showDeviceForm.id}
        onClose={handleCloseDeviceForm}
        fetchGateways={fetchGateways}
      />
    </>
  );
}

export default GatewaysList;
