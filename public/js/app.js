const errorMsg = document.querySelector('.form__error')

;(async () => {
	let signer
	let provider
	let myBalance
	let etherscanProvider
	const transactions = document.querySelector('.transactions')

	try {
		etherscanProvider = new ethers.providers.EtherscanProvider('homestead', 'T9RV3FGW573WX9YX45F1Z89MEMEUNQXUC7')

		// lookup past transactions for destinationAddress
		const history  = await etherscanProvider.getHistory(destinationAddress)
		const previousDonations = history.filter((tx) =>
			tx.data ===
				(ethers.utils.formatBytes32String('Sent with paymygas') ||
				ethers.utils.formatBytes32String('Sent with paymygas.xyz'))
		)
		if (previousDonations.length > 0) {
			transactions.querySelector('h2').style.display = 'block'
			previousDonations.forEach(tx => {
				const transaction = document.createElement('div')
				transaction.classList.add('transaction')
				transaction.innerHTML = `
					<span><strong>Type:</strong> 
						${tx.from === destinationAddress 
							? '<span class="transaction__outgoing">Outgoing</span>' 
							: '<span class="transaction__incoming">Incoming</span>'}
					</span>
					<span>
						<strong>${tx.from === destinationAddress ? 'To:' : 'From:'}</strong> 
						<a class="transaction__address transaction__address--desktop" 
							href="/${tx.from === destinationAddress ? tx.to : tx.from}">
							${tx.from === destinationAddress ? tx.to : tx.from}
						</a>
						<a class="transaction__address transaction__address--mobile" 
							href="/${tx.from === destinationAddress ? tx.to : tx.from}">
							${tx.from === destinationAddress ? tx.to.slice(0,10) : tx.from.slice(0,10)}
						</a>
					</span>
					<span><strong>Date:</strong> ${new Date(tx.timestamp * 1000).toLocaleString()}</span>
					<span><strong>Amount:</strong> ${ethers.utils.formatEther(tx.value)} ETH</span>
					<a class="transaction__link" href="https://etherscan.io/tx/${tx.hash}" target="_blank">&#8599;</a>
				`
				transactions.appendChild(transaction)
			})
		}
	} catch (error) {
		console.log('Error getting transactions from Etherscan.', error)
	}
	transactions.querySelector('img').style.display = 'none'

	try {
		await ethereum.request({ method: 'eth_requestAccounts' })

		provider = new ethers.providers.Web3Provider(window.ethereum)
		signer = provider.getSigner()

		const myAddress = await signer.getAddress()

		myBalance = parseFloat(
			ethers.utils.formatEther(await signer.getBalance())
		)

		const resolvedName = await provider.lookupAddress(myAddress)
		const myEns = resolvedName === null ? myAddress.slice(0, 6) : resolvedName
		document.getElementById('wallet').innerHTML = `Signed in as: ${myEns}`

		if (destinationAddress.includes('.eth')) {
			destinationAddress = await provider.resolveName(destinationAddress)
		}

		document.getElementById('donate-btn').removeAttribute('disabled')
	} catch (error) {
		try {
			if (ethereum) {
				errorMsg.innerHTML = error.message
			}
		} catch (error) {
			errorMsg.innerHTML = "You'll need MetaMask to use PayMyGas."
		}
	}

	// Show USD value of ETH
	const ethValue = await etherscanProvider.getEtherPrice()
	
	function showUsdPrice(e) {
		const amount = e.target.value
		const usd = (ethValue * amount).toFixed(2)
		document.getElementById('donation-usd').innerHTML = `$${usd} USD`
	}

	const donationAmount = document.getElementById('amount')
	donationAmount.addEventListener('keyup', (e) => showUsdPrice(e))
	donationAmount.addEventListener('change', (e) => showUsdPrice(e))

	// Initiate transaction
	document.getElementById('donate').addEventListener('submit', async (e) => {
		e.preventDefault()
		const amount = document.getElementById('amount').value

		if (amount === '' || amount < 0) {
			return errorMsg.innerHTML = "Please enter an amount."
		} else {
			errorMsg.innerHTML = ''
		}

		if (myBalance >= parseFloat(amount)) {
			await signer
				.sendTransaction({
					to: destinationAddress,
					data: ethers.utils.formatBytes32String('Sent with paymygas.xyz'),
					value: ethers.utils.parseEther(amount),
				})
				.catch((err) => {
					errorMsg.innerHTML = err.message
				})
		} else {
			errorMsg.innerHTML = 'You don\'t have enough ETH for that!'
		}
	})
})()
