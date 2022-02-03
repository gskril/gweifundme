;(async () => {
	let signer
	let provider
	let myBalance
	try {
		await ethereum.request({ method: 'eth_requestAccounts' })

		provider = new ethers.providers.Web3Provider(window.ethereum)
		signer = provider.getSigner()

		const myAddress = await signer.getAddress()

		myBalance = parseFloat(
			ethers.utils.formatEther(await signer.getBalance())
		)

		document.getElementById('wallet').innerHTML = `gm ${myAddress.slice(0,6)}`
		document.getElementById('connect').setAttribute('disabled', true)

		if (destinationAddress.includes('.eth')) {
			destinationAddress = await provider.resolveName('gregskril.eth')
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
