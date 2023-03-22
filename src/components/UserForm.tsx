import React, {useState, ChangeEvent, FormEvent} from 'react';
import {IContact} from "../data/contacts";

interface UserFormProps {
    onSubmit: (user: Omit<IContact, 'id'>) => void;
    onCancel: () => void;
}

function UserForm({ onSubmit, onCancel }: UserFormProps) {
    const [user, setUser] = useState<Omit<IContact, 'id'>>({
        name: '',
        phone: '',
        age: 0,
        email: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(user);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Name：</label>
            <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                required
            />
            <br />
            <label>Phone：</label>
            <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                required
            />
            <br />
            <label>Age：</label>
            <input
                type="number"
                name="age"
                value={user.age}
                onChange={handleChange}
                required
            />
            <br />
            <label>Email：</label>
            <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
            />
            <br />
            <button type="submit">Confirm</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
}

export default UserForm;
