import { Popconfirm, Space, Typography } from 'antd';
import { useApi } from '../../../../api';

type ActionsTemplateParams = {
  params: { id: string, uid: number },
  fetchGateways: () => void;
}

export default function DevicesActionsTemplate(actionsTemplateParams: ActionsTemplateParams) {
  const { params: { id, uid }, fetchGateways } = actionsTemplateParams;
  const { removeGatewayDevice } = useApi();
  const handleOnDelete = () => {
    removeGatewayDevice(id, uid).then(() => {
        fetchGateways()
    }).catch((err) => {
      console.error(err);
    });
  };

  return(
    <Space size="middle">
      <Popconfirm title="Sure to delete?" onConfirm={handleOnDelete}>
        <Typography.Link>Delete</Typography.Link>
      </Popconfirm>
    </Space>
  )
}
