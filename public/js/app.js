if (
	(!destinationAddress.includes('.eth') && !destinationAddress.includes('0x')) ||
	(destinationAddress.includes('0x') && destinationAddress.length !== 42)
) {
	document.getElementById('error').innerHTML =
		'Make sure you double check the address before sending ETH. This one looks invalid.'
}

;(async () => {
	let signer
	let provider
	let myBalance
	let etherscanProvider
	try {
		await ethereum.request({ method: 'eth_requestAccounts' })

		provider = new ethers.providers.Web3Provider(window.ethereum)
		etherscanProvider = new ethers.providers.EtherscanProvider('homestead', 'T9RV3FGW573WX9YX45F1Z89MEMEUNQXUC7')
		signer = provider.getSigner()

		const myAddress = await signer.getAddress()

		myBalance = parseFloat(
			ethers.utils.formatEther(await signer.getBalance())
		)

		document.getElementById('wallet').innerHTML = `gm ${myAddress.slice(0,6)}`
		document.getElementById('connect').setAttribute('disabled', true)

		if (destinationAddress.includes('.eth')) {
			destinationAddress = await provider.resolveName(destinationAddress)
		}

		// lookup past transactions for destinationAddress
		const history  = await etherscanProvider.getHistory(destinationAddress)
		const previousDonations = history.filter(tx => tx.data === ethers.utils.formatBytes32String('Sent with paymygas'))
		if (previousDonations.length > 0) {
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
		alert(error.message)
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
