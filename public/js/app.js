const errorMsg = document.querySelector('.form__error')

if (
	(!destinationAddress.includes('.eth') && !destinationAddress.includes('0x')) ||
	(destinationAddress.includes('0x') && destinationAddress.length !== 42)
) {
	errorMsg.innerHTML =
		'Double check the address before sending ETH. This one looks invalid.'
}

;(async () => {
	let signer
	let provider
	let myBalance
	let etherscanProvider

	try {
		etherscanProvider = new ethers.providers.EtherscanProvider('homestead', 'T9RV3FGW573WX9YX45F1Z89MEMEUNQXUC7')

		// lookup past transactions for destinationAddress
		const history  = await etherscanProvider.getHistory(destinationAddress)
		const previousDonations = history.filter(tx => tx.data === ethers.utils.formatBytes32String('Sent with paymygas'))
		if (previousDonations.length > 0) {
			document.querySelector('.transactions').style.display = "block"
			previousDonations.forEach(tx => {
				const transaction = document.createElement('div')
				transaction.classList.add('transaction')
				transaction.innerHTML = `
					<span class="transaction__date">${new Date(tx.timestamp * 1000).toLocaleString()}</span>
					<span class="transaction__amount">${ethers.utils.formatEther(tx.value)}</span>
					<a href="https://etherscan.io/tx/${tx.hash}" target="_blank">Etherscan</a>
				`
				document.querySelector('.transactions').appendChild(transaction)
			})
		}
	} catch (error) {
		console.log('Error getting transactions from Etherscan.', error)
	}

	try {
		await ethereum.request({ method: 'eth_requestAccounts' })

		provider = new ethers.providers.Web3Provider(window.ethereum)
		signer = provider.getSigner()

		const myAddress = await signer.getAddress()

		myBalance = parseFloat(
			ethers.utils.formatEther(await signer.getBalance())
		)

		document.getElementById('wallet').innerHTML = `Signed in as: ${myAddress.slice(0,6)}`

		if (destinationAddress.includes('.eth')) {
			destinationAddress = await provider.resolveName(destinationAddress)
		}

		document.getElementById('donate-btn').removeAttribute('disabled')
	} catch (error) {
		try {
			if (ethereum) {
				alert(error.message)
			}
		} catch (error) {
			errorMsg.innerHTML = "You need MetaMask installed."
		}
	}

	document.getElementById('donate').addEventListener('submit', async (e) => {
		e.preventDefault()
		const amount = document.getElementById('amount').value

		if (myBalance >= parseFloat(amount)) {
			await signer
				.sendTransaction({
					to: destinationAddress,
					data: ethers.utils.formatBytes32String('Sent with paymygas'),
					value: ethers.utils.parseEther(amount),
				})
				.catch((err) => {
					alert(err.message)
				})
		} else {
			alert('You do not have enough funds!')
		}
	})
})()
