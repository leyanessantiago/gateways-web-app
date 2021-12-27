import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import * as Api from '../../../../api';
import GatewayForm from '../index';

const id = 'id'

const gateway = {
  serialNumber: 'serial-number',
  name: 'name',
  ipV4Address: '192.168.1.1',
  devices: undefined,
}

describe('<GatewayForm />', () => {
  let getGatewayByIdMock: jest.Mock<any, any>;
  let createGatewayMock: jest.Mock<any, any>;
  let updateGatewayMock: jest.Mock<any, any>;
  beforeEach(() => {
    getGatewayByIdMock = jest.fn().mockResolvedValueOnce(gateway);
    createGatewayMock = jest.fn();
    updateGatewayMock = jest.fn();
    jest.spyOn(Api, 'useApi').mockImplementation(() => ({
      getGatewayById: getGatewayByIdMock,
      createGateway: createGatewayMock,
      updateGateway: updateGatewayMock,
    } as any));
  })
  it('should call the getGatewayBySerialNumber api call once with the right params', () => {
    render(
        <Api.ApiProvider>
          <GatewayForm visible id={id} onClose={() => {}} fetchGateways={() => {}} />
        </Api.ApiProvider>
    );

    expect(getGatewayByIdMock).toHaveBeenCalledWith(id)
    expect(getGatewayByIdMock).toHaveBeenCalledTimes(1)
  });

  it('should call the createGateway api call when submit and there is not a id', () => {
    render(
        <Api.ApiProvider>
          <GatewayForm visible onClose={() => {}} fetchGateways={() => {}} />
        </Api.ApiProvider>
    );

    fireEvent.change(screen.getByLabelText(/Serial Number/i), { target: { value: gateway.serialNumber } })
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: gateway.name } })
    fireEvent.change(screen.getByLabelText(/IP Address/i), { target: { value: gateway.ipV4Address } })

    fireEvent.click(screen.getByText(/Submit/i));

    expect(createGatewayMock).toHaveBeenCalledWith(gateway)
    expect(createGatewayMock).toHaveBeenCalledTimes(1)
  });

  it('should call the updateGateway api call when submit and there is an id', async () => {
    render(
        <Api.ApiProvider>
          <GatewayForm visible id={id} onClose={() => {}} fetchGateways={() => {}} />
        </Api.ApiProvider>
    );

    await screen.findByLabelText(/Name/i);
    fireEvent.change(screen.getByLabelText(/Serial Number/i), { target: { value: gateway.serialNumber } })
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: gateway.name } })
    fireEvent.change(screen.getByLabelText(/IP Address/i), { target: { value: gateway.ipV4Address } })

    fireEvent.click(screen.getByText(/Submit/i));

    expect(updateGatewayMock).toHaveBeenCalledWith(id, gateway)
    expect(updateGatewayMock).toHaveBeenCalledTimes(1)
  });
});
