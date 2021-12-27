import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import GatewaysList from '../index';
import * as Api from '../../../../api';

describe('<GatewaysList />', () => {
  it('should call the getGateways api call once with the right params', () => {
    const getGatewaysMock = jest.fn();
    jest.spyOn(Api, 'useApi').mockImplementation(() => ({
      getGateways: getGatewaysMock,
    } as any));
    render(
        <Api.ApiProvider>
          <GatewaysList />
        </Api.ApiProvider>
    );

    expect(getGatewaysMock).toHaveBeenCalledWith({
      limit: 10,
      page: 1,
    })
    expect(getGatewaysMock).toHaveBeenCalledTimes(1)
  });

  it('should open the Create gateway drawer when click create button', () => {
    const getGatewaysMock = jest.fn();
    jest.spyOn(Api, 'useApi').mockImplementation(() => ({
      getGateways: getGatewaysMock,
    } as any));
    render(
        <Api.ApiProvider>
          <GatewaysList />
        </Api.ApiProvider>
    );

    fireEvent.click(screen.getByText(/New Gateway/i));

    expect(screen.getByText(/Create a Gateway/i)).toBeTruthy();
  });
});
