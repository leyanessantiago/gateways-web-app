import React from 'react';
import { Popconfirm, Space, Typography } from 'antd';
import { useApi } from '../../../../api';

type ActionsTemplateParams = {
  showForm: (id: string) => void;
  showAddDevice: (id: string) => void;
  id: string;
  fetchGateways: () => void;
}

export default function GatewaysActionsTemplate(actionsTemplateParams: ActionsTemplateParams) {
  const { showForm, showAddDevice, fetchGateways, id } = actionsTemplateParams;
  const { deleteGateway } = useApi();
  const handleOnDelete = () => {
    deleteGateway(id).then(() => {
        fetchGateways()
    }).catch((err) => {
      console.error(err);
    });
  };

  const handleOnAddDevice = () => {
    showAddDevice(id)
  };

  const handleOnEdit = () => {
    showForm(id)
  };

  return(
    <Space size="middle">
      <Typography.Link onClick={handleOnEdit}>Edit</Typography.Link>
      <Popconfirm title="Sure to delete?" onConfirm={handleOnDelete}>
        <Typography.Link>Delete</Typography.Link>
      </Popconfirm>
      <Typography.Link onClick={handleOnAddDevice}>Add Device</Typography.Link>
    </Space>
  )
}
