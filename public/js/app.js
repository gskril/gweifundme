const errorMsg = document.querySelector('.form__error')

;(async () => {
	let signer
	let provider
	let myBalance
	let etherscanProvider
	let chainId
	const transactions = document.querySelector('.transactions')

	const getEnsName = async (addr) => {
		return fetch(`https://api.ensideas.com/ens/resolve/${addr}`)
			.then((res) => res.json())
			.then((json) => {
				return json.displayName
			})
	}

	try {
		etherscanProvider = new ethers.providers.EtherscanProvider('homestead', 'T9RV3FGW573WX9YX45F1Z89MEMEUNQXUC7')
		ethPrice = await etherscanProvider.getEtherPrice()

		// lookup past transactions for destinationAddress
		const history  = await etherscanProvider.getHistory(destinationAddress)
		const previousDonations = history.filter((tx) =>
			tx.data === ethers.utils.formatBytes32String('Sent with gweifund.me') ||
			tx.data === ethers.utils.formatBytes32String('Sent with paymygas')
		)
		if (previousDonations.length > 0) {
			transactions.querySelector('h2').style.display = 'block'
			previousDonations.reverse()
			for (let i = 0; i < previousDonations.length; i++) {
				const tx = previousDonations[i]

				const priceInEth = ethers.utils.formatEther(tx.value)
				const priceInUsd = parseFloat(priceInEth * ethPrice).toFixed(2)
				const transaction = document.createElement('div')
				const to = await getEnsName(tx.to)
				const from = await getEnsName(tx.from)
				transaction.classList.add('transaction')
				transaction.innerHTML = `
					<span><strong>Type:</strong> 
						${
							tx.from === destinationAddress
								? '<span class="transaction__outgoing">Outgoing</span>'
								: '<span class="transaction__incoming">Incoming</span>'
						}
					</span>
					<span>
						<strong>${tx.from === destinationAddress ? 'To:' : 'From:'}</strong> 
						<a class="transaction__address" 
							href="/${tx.from === destinationAddress ? tx.to : tx.from}">
							${
								tx.from === destinationAddress
									? to
									: from
							}
						</a>
					</span>
					<span><strong>Date:</strong> ${new Date(
						tx.timestamp * 1000
					).toLocaleString()}</span>
					<span><strong>Amount:</strong> ${priceInEth} ETH ($${priceInUsd} USD)</span>
					<a class="transaction__link" href="https://etherscan.io/tx/${
						tx.hash
					}" target="_blank">&#8599;</a>
				`
				transactions.appendChild(transaction)
			}
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

		chainId = await provider.getNetwork()
		chainId = chainId.chainId
		let resolvedName
		let myEns
		
		if (chainId === 1) {
			// Ethereum
			resolvedName = await provider.lookupAddress(myAddress)
			myEns = resolvedName === null ? myAddress.slice(0, 6) : resolvedName
		} else if (chainId === 137) {
			// Polygon
			myEns = myAddress.slice(0, 6)
		} else {
			return errorMsg.innerHTML = "Only Ethereum and Polygon are supported at this time."
		}

		document.getElementById('wallet').innerHTML = `Signed in as: ${myEns}`
		document.getElementById('donate-btn').removeAttribute('disabled')

		/* Get metadata from ENS to make a full profile

		const resolver = await provider.getResolver(destinationEns)
		const description = await resolver.getText("description")
		const twitter = await resolver.getText("com.twitter")
		const github = await resolver.getText("com.github")
		const url = await resolver.getText("url")

		console.log(description, twitter, discord, github, url)
 		*/
		 
	} catch (error) {
		try {
			if (ethereum) {
				errorMsg.innerHTML = error.message
			}
		} catch (error) {
			errorMsg.innerHTML = "You'll need MetaMask to use GweiFundMe."
		}
	}

	let tokenValue

	if (chainId === 1) {
		// Show USD value of ETH
		tokenValue = await etherscanProvider.getEtherPrice()
	} else if (chainId === 137) {
		// Show USD value of MATIC
		tokenValue = fetch('https://min-api.cryptocompare.com/data/price?fsym=MATIC&tsyms=USD')
			.then(async (res) => res.json())
			.then(data => data.USD)
		
		tokenValue = await tokenValue
		document.getElementById('amount').setAttribute('step', '0.1')
		document.querySelector('.form__label[for="amount"]').innerHTML = 'How much MATIC would you like to send?'
	}



	function showUsdPrice(tokenValue, e) {
		const amount = e.target.value
		const usd = (tokenValue * amount).toFixed(2)
		document.getElementById('donation-usd').innerHTML = `$${usd} USD`
	}

	const donationAmount = document.getElementById('amount')
	donationAmount.addEventListener('keyup', (e) => showUsdPrice(tokenValue, e))
	donationAmount.addEventListener('change', (e) => showUsdPrice(tokenValue, e))

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
					data: ethers.utils.formatBytes32String('Sent with gweifund.me'),
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
