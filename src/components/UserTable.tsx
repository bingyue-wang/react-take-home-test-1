import React, {useEffect, useState} from 'react';
import UserForm from "./UserForm";
import {apiAddContact, apiDeleteContact, apiFetchAllContacts, apiUpdateContact, IContact} from "../data/contacts";
import {generateUUID} from "../util/guid";
import useApiCall from "../utils/useApiCall";

/**
 * User interface with editing flag
 */
interface IUserWithEditing extends IContact {
    editing: boolean;
}

/**
 * UserTable component
 * @constructor
 */
function UserTable() {
    const [users, setUsers] = useState<IUserWithEditing[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editedUsers, setEditedUsers] = useState<IUserWithEditing[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [callApi, loading] = useApiCall();

    // use error to display error message
    const errorMessage = error ? <div className="error">{error}</div> : null;

    // loading message when fetching data
    const loadingMessage = loading ? (
        <div className="loadingModal">
            <div className="loadingMessage">Loading...</div>
        </div>
    ) : null;


    // Fetch all contacts on mount and set users state
    useEffect(() => {
        const fetchAllContacts = async () => {
            try {
                const contacts = await callApi(apiFetchAllContacts);
                setUsers(contacts.map((contact: IContact) => ({...contact, editing: false})));
            } catch (err) {
                setError((err as Error).message);
            }
        };
        fetchAllContacts();
    }, []);

    // Add a new user to the list
    const addUser = async (user: Omit<IContact, 'id'>) => {
        const newUser = {
            id: generateUUID(),
            ...user,
            editing: false
        };
        await callApi(apiAddContact, newUser)
        setUsers([...users, newUser]);
        setShowModal(false);
    };

    // Delete a user by id
    const deleteUser = async (id: string) => {
        try {
            await callApi(apiDeleteContact, id);
            setUsers(users.filter((user) => user.id !== id));
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    // Save a user after editing
    const saveUser = async (user: IUserWithEditing) => {
        // Update users state immediately
        const updatedUsers = users.map((u) => (u.id === user.id ? {...user, editing: false} : u));
        setUsers(updatedUsers);

        try {
            await callApi(apiUpdateContact, user);
            setError(null);
        } catch (err) {
            setError((err as Error).message);
            // Revert users state to the previous state in case of an error
            setUsers(users);
        }
    };


    // Toggle editing state of a user and save the user if editing is false
    const toggleEdit = (index: number) => {
        const newUsers = [...users];
        newUsers[index].editing = !newUsers[index].editing;
        setUsers(newUsers);

        if (!newUsers[index].editing) {
            // Save the user
            saveUser(editedUsers[index]);
        } else {
            // Start editing the user
            const newEditedUsers = [...editedUsers];
            newEditedUsers[index] = {...newUsers[index]};
            setEditedUsers(newEditedUsers);
        }
    };

    // Handle input change for editing users
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        userIndex: number,
        fieldName: keyof IContact
    ) => {
        const newValue = event.target.value;
        const newEditedUsers = [...editedUsers];
        (newEditedUsers[userIndex][fieldName] as any) = newValue;
        setEditedUsers(newEditedUsers);
    };

    return (
        <>
            <button onClick={() => setShowModal(true)}>Add New</button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>添加新用户</h2>
                        <UserForm onSubmit={addUser} onCancel={() => setShowModal(false)}/>
                    </div>
                </div>
            )}
            {errorMessage}
            {loadingMessage}
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Age</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                            <input
                                type="text"
                                value={user.editing ? editedUsers[index].name : user.name}
                                onChange={(e) => handleInputChange(e, index, 'name')}
                                readOnly={!user.editing}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value={user.editing ? editedUsers[index].phone : user.phone}
                                onChange={(e) => handleInputChange(e, index, 'phone')}
                                readOnly={!user.editing}
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                value={user.editing ? editedUsers[index].age : user.age}
                                onChange={(e) => handleInputChange(e, index, 'age')}
                                readOnly={!user.editing}
                            />
                        </td>
                        <td>
                            <input
                                type="string"
                                value={user.editing ? editedUsers[index].email : user.email}
                                onChange={(e) => handleInputChange(e, index, 'email')}
                                readOnly={!user.editing}
                            />
                        </td>
                        <td>
                            <button onClick={() => toggleEdit(index)}>
                                {user.editing ? 'Save' : 'Edit'}
                            </button>
                            <button onClick={() => deleteUser(user.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default UserTable;
