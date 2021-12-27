function hasValue(value: any) {
    return value !== undefined && value !== null && value !== '';
}

const generateParamsString = (obj: any) => {
    if (obj) {
        let queryParam = Object.keys(obj)
            .map((key) => {
                const value = obj[key];
                if (hasValue(value)) {
                    if (Array.isArray(value)) {
                        return value.map((val) => {
                            if (hasValue(val)) {
                                return `${key}=${val}`;
                            }
                            return null;
                        }).join('&');
                    }
                    return `${key}=${value}`;
                }
                return null;
            })
            .join('&');
        queryParam = queryParam && queryParam !== '' ? `${queryParam}&` : queryParam;
        queryParam = queryParam[queryParam.length - 1] === '&'
            ? queryParam.slice(0, Math.max(0, queryParam.length - 1))
            : queryParam;
        return queryParam;
    }
    return '';
};

function generateQueryObject(filters: any, page: number = 0, limit: number = 0) {
    const queryParams: any = {};
    if (page !== undefined && page !== null) {
        queryParams.page = page;
    }

    if (limit !== undefined && limit !== null) {
        queryParams.limit = limit;
    }

    if (filters) {
        Object.keys(filters).forEach((key) => {
            const filter = filters[key];
            if (hasValue(filter)) {
                const isObject = typeof filter === 'object';
                const isArray = Array.isArray(filter);

                if (isArray) {
                    queryParams[key] = filter.map((val) => !!val && !!val.value ? val.value : val);
                } else if (isObject) {
                    const keys = Object.keys(filter);
                    const hasValueKey = keys.some((k) => k === 'value');
                    if (hasValueKey) {
                        if (hasValue(filter.value)) {
                            queryParams[key] = filter.value;
                        }
                    } else {
                        keys.forEach((k) => {
                            if (filter[k] || filter[k] === 0) {
                                queryParams[k] = filter[k];
                            }
                        });
                    }
                } else {
                    queryParams[key] = filter;
                }
            }
        });
    }
    return queryParams;
}

// @ts-ignore
export function generateQueryString({ filters, page, limit }: QueryParams) {
    const params = generateQueryObject(filters, page, limit);
    return generateParamsString(params);
}

export interface QueryParams {
  page?: number;
  limit?: number;
  filters?: { [x: string]: any };
}
