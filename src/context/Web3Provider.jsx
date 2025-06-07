import React, { useState } from 'react'
import { Web3Context } from './CreateWeb3Context';

function Web3Provider({children}) {

    const [web3State, setWeb3State] = useState({
        contractInstance: null,
        selectedAccount: null
    });

    const updateWeb3State = (newState) => {
        setWeb3State(prevState => ({
            ...prevState,
            ...newState
        }))
    }

    const value = {
        web3State, setWeb3State, updateWeb3State
    }

  return (
    <Web3Context.Provider value={value}>
        {children}
    </Web3Context.Provider>
  )
}

export default Web3Provider
