import React, { createContext } from 'react';
import { get, post, put, del, PagedResponse, patch } from './base';
import { DeviceDto, GatewayDto } from '../model/gateway.dto';
import { QueryParams } from './base/query-params';
import { AxiosResponse } from 'axios';

interface Api {
  getGateways: (params: { page: number, limit: number }) => Promise<AxiosResponse<PagedResponse<GatewayDto>>>;
  getGatewayById: (id: string) => Promise<AxiosResponse<GatewayDto>>;
  createGateway: (payload: GatewayDto) => Promise<AxiosResponse<GatewayDto>>;
  updateGateway: (id: string, payload: GatewayDto) => Promise<AxiosResponse<GatewayDto>>;
  deleteGateway: (id: string) => Promise<AxiosResponse<GatewayDto>>;
  addGatewayDevice: (id?: string, payload?: DeviceDto) => Promise<AxiosResponse<GatewayDto>>;
  removeGatewayDevice: (id?: string, uid?: number) => Promise<AxiosResponse<GatewayDto>>;
}
export const ApiContext = createContext<Api | null>(null);

// @ts-ignore
export function ApiProvider({ children }) {
    const getGateways = (params: QueryParams): Promise<AxiosResponse<PagedResponse<GatewayDto>>> => {
        return get('gateways', { params });
    };

    const getGatewayById = (id: string): Promise<AxiosResponse<GatewayDto>> => {
        return get(`gateways/${id}`);
    };

    const createGateway = (payload: GatewayDto): Promise<AxiosResponse<GatewayDto>> => {
        return post('gateways', payload);
    };

    const updateGateway = (id: string, payload: GatewayDto): Promise<AxiosResponse<GatewayDto>> => {
        return put(`gateways/${id}`, payload);
    };

    const deleteGateway = (id: string): Promise<AxiosResponse<GatewayDto>> => {
        return del(`gateways/${id}`);
    };

    const addGatewayDevice = (id?: string, payload?: DeviceDto): Promise<AxiosResponse<GatewayDto>> => {
        return patch(`gateways/${id}/device`, payload);
    };

    const removeGatewayDevice = (id?: string, uid?: number) => {
        return del(`gateways/${id}/device/${uid}`);
    };

    return (
        <ApiContext.Provider
            value={{
                getGateways,
                getGatewayById,
                createGateway,
                updateGateway,
                deleteGateway,
                addGatewayDevice,
                removeGatewayDevice,
            }}
        >
            <>{children}</>
        </ApiContext.Provider>
    );
}

export function useApi() {
    const api = React.useContext(ApiContext);
    if (api === null) {
        throw new Error('Must use ApiContext within the ApiProvider');
    }
    return api;
}
