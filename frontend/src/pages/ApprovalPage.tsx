import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
const TickIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> );
interface User {
    id: number;
    username: string;
    email: string;
    phoneNumber: string;
    role: string;
    authorized: boolean;
}

const ApprovalPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users. You may not have permission.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleAuthorize = async (userId: number) => {
        setMessage('');
        try {
            const res = await api.patch(`/users/${userId}/authorize`);
            setUsers(users.map(user =>
                user.id === userId ? { ...user, authorized: true } : user
            ));
            setMessage(res.data.message);
        } catch (err) {
            setError('Failed to authorize user.');
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-white p-8">
            <Link to="/dashboard" className="text-blue-600 hover:underline mb-6 block">&larr; Back to Dashboard</Link>
            <h1 className="text-3xl font-bold mb-6">User Approval</h1>
            {message && <div className="p-4 mb-4 bg-green-100 text-green-800 rounded">{message}</div>}
            
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Username</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4">
                                    {user.authorized ? 
                                        <span className="text-green-600 font-bold">Authorized</span> : 
                                        <span className="text-yellow-600 font-bold">Pending</span>
                                    }
                                </td>
                                <td className="px-6 py-4">
                                    {!user.authorized && (
                                        <button onClick={() => handleAuthorize(user.id)} className="p-1 rounded-full hover:bg-green-100">
                                            <TickIcon />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovalPage;