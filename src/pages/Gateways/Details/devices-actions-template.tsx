import React from 'react';
import { Popconfirm, Space, Typography } from 'antd';

type ActionsTemplateParams = {
    uid: number,
    handleOnDeleteDevice: (uid: number) => void
}

export default function DevicesActionsTemplate(actionsTemplateParams: ActionsTemplateParams) {
    const { uid, handleOnDeleteDevice } = actionsTemplateParams;
    const handleOnDelete = () => {
        handleOnDeleteDevice(uid)
    };

    return(
        <Space size="middle">
            <Popconfirm title="Sure to delete?" onConfirm={handleOnDelete}>
                <Typography.Link>Delete</Typography.Link>
            </Popconfirm>
        </Space>
    )
}
