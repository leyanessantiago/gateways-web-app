import React from 'react';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GatewayDto } from '../../../../model/gateway.dto';

export default function GatewaysSerialNumberTemplate(serialNumber: string, gateway: GatewayDto) {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(`/details/${gateway._id}`);
  };

  return <Typography.Link onClick={handleOnClick}>{serialNumber}</Typography.Link>;
}
