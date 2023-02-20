import React, { useEffect, useState } from 'react'
import './Cdash.css'
import { useParams } from 'react-router-dom'
import { ethers } from 'ethers'
import { ContractAddress, abi } from './constants'

function App() {
  let { id } = useParams()
  const [contractdetail, setcontractdetail] = useState([])

  const [contractdetails, setcontractdetails] = useState([[]])
  const [contractid, setcontractid] = useState([])

  const [load, setLoad] = useState(true)
  const [init, setinit] = useState('20000')

  const [link, setLink] = useState(
    'https://ipfs.io/ipfs/bafkreifflr2si4cuzs2jq4ccbsklamr3o675rzwwo2t56l3uuhtnke7v5u',
  )
  const [bounty, setbounty] = useState('5 TFIL')

  useEffect(() => {
    async function retrieveContracts() {
      setcontractdetails([])

      const provider = new ethers.providers.JsonRpcProvider(
        'https://api.hyperspace.node.glif.io/rpc/v1',
      )
      const contract = new ethers.Contract(ContractAddress, abi, provider)
      const size = await contract.getArraySize()
      console.log(size)
      let arr = []
      for (var i = 0; i < size; i++) {
        const contractID = await contract.arrayID(i)
        if (!contractid.includes(contractID)) {
          contractid.push(contractID)
        }
        const contractDetails = await contract.getContract(contractID)
        arr.push(contractDetails)
      }
      setcontractdetails(arr)

      console.log(arr)
      console.log(id)

      //   console.log(contractid)

      //   contractdetails.forEach((data) => {
      //     console.log(data[0])
      //   })
    }

    retrieveContracts()
  }, [])

  async function setcontract(contractdetails) {
    for (let i = 0; i < contractdetails.length; i++) {
      console.log(contractdetails)
      if (id === contractdetails[i][2]) {
        setcontractdetail(contractdetails[i])
        setLoad(false)

        console.log(contractdetail)
      }
    }
  }
  useEffect(() => {
    setcontract(contractdetails)
  })

  // if (!load) {
  //   contractdetails.map((data) => {
  //     setinit(parseInt(data[3]._hex))
  //     setbounty(parseInt(data[4]._hex))

  //     setLink(`https://ipfs.io/ipfs/${data[1]}`)
  //   })
  // }

  const [hackerAddress, setHackerAdd] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Input value:', hackerAddress)
    verify(hackerAddress)
  }

  const handleInputChange = (event) => {
    setHackerAdd(event.target.value)
  }

  async function verify(h_address) {
    // h--> hacker  s--> smart contract

    var s_address = id
    var ini_balance = '20000'

    const res1 = await fetch(
      `https://hyperspace.filfox.info/api/v1/address/${h_address}/transfers?pageSize=1&page=0`,
    )
    const data1 = await res1.json()

    console.log('first data', data1)
    const from = data1.transfers[0].from
    const to = data1.transfers[0].to
    const value = data1.transfers[0].value

    const res2 = await fetch(
      `https://hyperspace.filfox.info/api/v1/address/${from}`,
    )
    const res3 = await fetch(
      `https://hyperspace.filfox.info/api/v1/address/${to}`,
    )
    const data2 = await res2.json()
    const data3 = await res3.json()
    const n_from = data2.ethAddress
    const n_to = data3.ethAddress
    console.log(value)
    console.log(
      n_from === s_address && n_to === h_address && value === ini_balance,
    )
    if (n_from === s_address && n_to === h_address && value === ini_balance) {
      await Bounty(id, h_address)
      alert(
        'You Have Succesfully Claimed the ownership !! Bounty Has been Credited to your account',
      )
    } else {
      alert('You havent claimed ownership')
    }
    return n_from === s_address && n_to === h_address && value === ini_balance
  }

  async function Bounty(contractID, winner) {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://api.hyperspace.node.glif.io/rpc/v1',
    )

    const signer = new ethers.Wallet('', provider)
    const contract = new ethers.Contract(ContractAddress, abi, signer)

    // var contractID = "adsd4432323";
    // var winner = "0xbE5C450ae99cD36D118822295c051C650FBbb7c8"

    try {
      const transactionResponse = await contract.awardBounty(contractID, winner)
      await listenForTransactionMine(transactionResponse, provider)
    } catch (error) {
      console.log(error)
    }
  }

  function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)

    return new Promise((resolve, revert) => {
      try {
        provider.once(transactionResponse.hash, (transactionReciept) => {
          console.log(`Done`)
        })
        resolve()
      } catch (error) {
        console.log(error)
      }
    })
  }
  // const handleDownload = async () => {
  //   const link = document.createElement('a');
  //   link.href = linksmAdd; // replace with your link to the smart contract
  //   link.download = "smart-contract.sol";
  //   link.click();
  // };

  const [contractCode, setContractCode] = useState('')

  const display = async () => {
    const response = await fetch(`${link}`)
    const contractCode = await response.text()
    setContractCode(contractCode)
  }

  useEffect(() => {
    display()
  }, [])

  return (
    <div className="cdash">
      <div className="smart-contract-box">
        <div className="smart-contract-item">
          <div className="smart-contract-label">Smart Contract Address:</div>
          <div className="smart-contract-value">{id}</div>
        </div>
        <div className="smart-contract-item">
          <div className="smart-contract-label">Initial Amount:</div>
          <div className="smart-contract-value">{init}</div>
        </div>
        <div className="smart-contract-item">
          <div className="smart-contract-label">Prize Money:</div>
          <div className="smart-contract-value">{bounty}</div>
        </div>

        {/* <a href={linksmAdd} download="smart-contract.sol">
            <button className="smart-contract-button">Download Smart Contract</button>
          </a> */}
      </div>
      {contractCode && (
        <div className="smart-contract-code">
          <pre>{contractCode}</pre>
        </div>
      )}
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            placeholder="Enter your waallet address here"
            className="input-field"
            value={hackerAddress}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="submit-button" on>
          Submit
        </button>
      </form>
    </div>
  )
}

export default App
