import React from 'react';
import UserTable from "./components/UserTable";

function App() {
    return (
        <div className="App container">
            <h1 className='text-center'>Brew Ninja Test App</h1>
            <h5 className='text-center'>Candidate: Bingyue Wang</h5>
            <UserTable/>
        </div>
    );
}

export default App;
