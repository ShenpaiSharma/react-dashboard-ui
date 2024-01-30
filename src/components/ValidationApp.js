import React, { useState } from 'react';
import Button from './Button/Button';

function ValidationApp() {
    const [currentPage, setCurrentPage] = useState('main');

    const redirectToProcess = (processName) => {
        setCurrentPage(processName);
    };

    const goBackToMain = () => {
        setCurrentPage('main');
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'main':
                return (
                    <div style={{
                        textAlign: 'center',
                        margin: '50px',
                    }}>
                        <h1>Welcome to Automation Checklist</h1>
                        <div style={{ margin: '6px', textAlign: 'center'}}>
                            <div style={{ display: 'flex', alignItems: 'center', margin: '6px' }}>
                                <h1 style={{ marginRight: '50px' }}>Basic Statistical Return - 1 (BSR1)</h1>
                                <Button name="Proceed" function={() => redirectToProcess('process1')} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', margin: '6px' }}>
                                <h1 style={{ marginRight: '50px' }}>Basic Statistical Return -2 (BSR-2)</h1>
                                <Button name="Proceed" function={() => redirectToProcess('process2')} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', margin: '6px' }}>
                                <h1 style={{ marginRight: '50px' }}>FMR-1</h1>
                                <Button name="Proceed" function={() => redirectToProcess('process3')} />
                            </div>
                        </div>
                    </div>
                );
            case 'process1':
                return (
                    <div>
                        <button style={{cursor: 'pointer'}} onClick={goBackToMain} >Back to Main</button>
                        <div style={{ display: 'flex', alignItems: 'center', margin: '6px' }}>
                            <h1 style={{ marginRight: '50px' }}>Basic Statistical Return - 1 (BSR1)</h1>
                            <Button name="Pre Check" function={() => redirectToProcess('process1')} />
                            <Button name="Validate" function={() => redirectToProcess('process1')} />
                            <Button name="Export" function={() => redirectToProcess('process1')} />

                        </div>
                    </div>
                );
            case 'process2':
                return (
                    <div>
                        <button style={{cursor: 'pointer'}} onClick={goBackToMain} >Back to Main</button>
                        <div style={{ display: 'flex', alignItems: 'center', margin: '6px' }}>
                            <h1 style={{ marginRight: '50px' }}>Basic Statistical Return - 2 (BSR2)</h1>
                            <Button name="Pre Check" function={() => redirectToProcess('process1')} />
                            <Button name="Validate" function={() => redirectToProcess('process1')} />
                            <Button name="Export" function={() => redirectToProcess('process1')} />

                        </div>
                    </div>
                );
            case 'process3':
                return (
                    <div>
                        <button style={{cursor: 'pointer'}} onClick={goBackToMain} >Back to Main</button>
                        <div style={{ display: 'flex', alignItems: 'center', margin: '6px' }}>
                            <h1 style={{ marginRight: '50px' }}>FMR - 1</h1>
                            <Button name="Pre Check" function={() => redirectToProcess('process1')} />
                            <Button name="Validate" function={() => redirectToProcess('process1')} />
                            <Button name="Export" function={() => redirectToProcess('process1')} />

                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {renderPage()}
        </div>
    );
}

export default ValidationApp;