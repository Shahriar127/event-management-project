import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function TestApi() {
    const [data, setData] = useState<Record<string, any> | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/ping');
                if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                const json = await res.json();
                setData(json);
            } catch (e: any) {
                setError(e?.message ?? String(e));
            }
        })();
    }, []);

    return (
        <div className="p-6">
            <Head title="Test API Connection" />
            <h1 className="text-2xl font-semibold mb-4">API Ping Test</h1>

            {error && (
                <div className="text-red-600 mb-4">Error: {error}</div>
            )}

            {data ? (
                <pre className="bg-gray-100 p-4 rounded">
                    {JSON.stringify(data, null, 2)}
                </pre>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}
