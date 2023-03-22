import { useState } from 'react';

type ApiFunction = (...args: any[]) => Promise<any>;

function useApiCall(): [(apiFunction: ApiFunction, ...args: any[]) => Promise<any>, boolean] {
    const [loading, setLoading] = useState(false);

    const call = async (apiFunction: ApiFunction, ...args: any[]) => {
        setLoading(true);
        try {
            const result = await apiFunction(...args);
            setLoading(false);
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    return [call, loading];
}

export default useApiCall;
