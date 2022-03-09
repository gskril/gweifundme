const errorMsg = document.querySelector('.form__error')

;(async () => {
	let signer
	let provider
	let myBalance
	let chainId
	const transactions = document.querySelector('.transactions')
	const etherscanProvider = new ethers.providers.EtherscanProvider('homestead', 'T9RV3FGW573WX9YX45F1Z89MEMEUNQXUC7')
	const ethPrice = await etherscanProvider.getEtherPrice()

	const getEnsName = async (addr) => {
		return fetch(`https://api.ensideas.com/ens/resolve/${addr}`)
			.then((res) => res.json())
			.then((json) => {
				return json.displayName
			})
	}

	try {
		// Get metadata from ENS to make a full profile
		const resolver = await etherscanProvider.getResolver(destinationEns)
		const ensRecords = {
			description: await resolver.getText("description"),
			twitter: await resolver.getText("com.twitter"),
			github: await resolver.getText("com.github"),
			url: await resolver.getText("url"),
		}
		
		if (Object.values(ensRecords).every((value) => value === null)) {
			console.log('No ENS metadata found')
		} else {
			const profile = document.querySelector('.profile')
			const socialLinks = document.querySelector('.profile__social')
			profile.classList.add('profile--active')
	
			if (ensRecords.description) {
				const descriptionEl = document.createElement('p')
				descriptionEl.innerHTML = `${ensRecords.description}`
				profile.prepend(descriptionEl)
			}

			if (ensRecords.url) {
				const urlEl = document.createElement('a')
				urlEl.classList.add('profile__link')
				urlEl.href = ensRecords.url
				urlEl.target = '_blank'
				urlEl.setAttribute('rel', 'noopener noreferrer')
				urlEl.innerHTML = `
					<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16ZM10.9332 13.5062C11.8033 12.6365 12.9832 12.1479 14.2134 12.1479C15.4436 12.1479 16.6235 12.6365 17.4936 13.5062C17.8842 13.8967 17.8844 14.5298 17.4939 14.9204C17.1035 15.311 16.4703 15.3112 16.0797 14.9207C15.5847 14.4259 14.9134 14.1479 14.2134 14.1479C13.5135 14.1479 12.8422 14.4259 12.3471 14.9207L12.3471 14.9207L11.0601 16.2073L9.77316 17.4938L9.77304 17.4939C9.27807 17.989 9 18.6604 9 19.3604C9 20.0605 9.27811 20.7319 9.77316 21.227C10.2682 21.722 10.9396 22.0001 11.6397 22.0001C12.3398 22.0001 13.0112 21.722 13.5063 21.227L14.7929 19.9403C15.1834 19.5498 15.8166 19.5498 16.2071 19.9403C16.5977 20.3309 16.5977 20.964 16.2071 21.3545L14.9205 22.6412C14.0504 23.5113 12.8703 24.0001 11.6397 24.0001C10.4092 24.0001 9.22906 23.5113 8.35894 22.6412C7.48883 21.7711 7 20.5909 7 19.3604C7 18.1299 7.48883 16.9497 8.35894 16.0796L8.35906 16.0795L9.6461 14.7929L10.9332 13.5062L10.9332 13.5062ZM19.3604 7C18.1299 7 16.9497 7.48883 16.0796 8.35894L14.793 9.64557C14.4025 10.0361 14.4025 10.6693 14.793 11.0598C15.1835 11.4503 15.8167 11.4503 16.2072 11.0598L17.4938 9.77316C17.9889 9.27811 18.6603 9 19.3604 9C20.0605 9 20.7319 9.27811 21.227 9.77316C21.722 10.2682 22.0001 10.9396 22.0001 11.6397C22.0001 12.3398 21.722 13.0111 21.2271 13.5062L21.227 13.5063L18.6868 16.0457C17.9571 16.644 17.4338 16.8522 16.7867 16.8522C16.0868 16.8522 15.4155 16.5742 14.9204 16.0794C14.5298 15.689 13.8966 15.6891 13.5062 16.0797C13.1158 16.4703 13.1159 17.1035 13.5065 17.4939C14.3766 18.3636 15.5565 18.8522 16.7867 18.8522C18.0596 18.8522 19.0263 18.3627 19.9984 17.5563C20.0222 17.5366 20.0451 17.5158 20.067 17.4939L22.6411 14.9206L22.6412 14.9205C23.5113 14.0504 24.0001 12.8703 24.0001 11.6397C24.0001 10.4092 23.5113 9.22906 22.6412 8.35894C21.7711 7.48883 20.5909 7 19.3604 7Z" fill="#4b7ceb"/>
					</svg>`
				socialLinks.appendChild(urlEl)
			}
	
			if (ensRecords.twitter) {
				const twitterEl = document.createElement('a')
				twitterEl.classList.add('profile__link', 'profile__link--twitter')
				twitterEl.href = `https://twitter.com/${ensRecords.twitter}`
				twitterEl.target = '_blank'
				twitterEl.setAttribute('rel', 'noopener noreferrer')
				twitterEl.innerHTML = `
					<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M16 0C7.16429 0 0 7.16429 0 16C0 24.8357 7.16429 32 16 32C24.8357 32 32 24.8357 32 16C32 7.16429 24.8357 0 16 0ZM23.6893 12.0607C23.7 12.2286 23.7 12.4036 23.7 12.575C23.7 17.8179 19.7071 23.8571 12.4107 23.8571C10.1607 23.8571 8.075 23.2036 6.31786 22.0786C6.63929 22.1143 6.94643 22.1286 7.275 22.1286C9.13214 22.1286 10.8393 21.5 12.2 20.4357C10.4571 20.4 8.99286 19.2571 8.49286 17.6857C9.10357 17.775 9.65357 17.775 10.2821 17.6143C9.38474 17.432 8.57813 16.9446 7.99934 16.2349C7.42056 15.5253 7.10531 14.6372 7.10714 13.7214V13.6714C7.63214 13.9679 8.25 14.15 8.89643 14.175C8.35301 13.8128 7.90735 13.3222 7.59897 12.7465C7.29059 12.1709 7.12901 11.528 7.12857 10.875C7.12857 10.1357 7.32143 9.46071 7.66786 8.875C8.66394 10.1012 9.9069 11.1041 11.3159 11.8184C12.725 12.5328 14.2686 12.9427 15.8464 13.0214C15.2857 10.325 17.3 8.14286 19.7214 8.14286C20.8643 8.14286 21.8929 8.62143 22.6179 9.39286C23.5143 9.225 24.3714 8.88929 25.1357 8.43929C24.8393 9.35714 24.2179 10.1321 23.3929 10.6214C24.1929 10.5357 24.9643 10.3143 25.6786 10.0036C25.1393 10.7964 24.4643 11.5 23.6893 12.0607V12.0607Z" fill="#1D9BF0"/>
					</svg>`
				socialLinks.appendChild(twitterEl)
			}
	
			if (ensRecords.github) {
				const githubEl = document.createElement('a')
				githubEl.classList.add('profile__link', 'profile__link--github')
				githubEl.href = `https://github.com/${ensRecords.github}`
				githubEl.target = '_blank'
				githubEl.setAttribute('rel', 'noopener noreferrer')
				githubEl.innerHTML = `
					<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M16 0C7.16 0 0 7.3411 0 16.4047C0 23.6638 4.58 29.795 10.94 31.9687C11.74 32.1122 12.04 31.6201 12.04 31.1894C12.04 30.7998 12.02 29.508 12.02 28.1341C8 28.8928 6.96 27.1293 6.64 26.2065C6.46 25.7349 5.68 24.279 5 23.8893C4.44 23.5818 3.64 22.823 4.98 22.8025C6.24 22.782 7.14 23.9919 7.44 24.484C8.88 26.9652 11.18 26.268 12.1 25.8374C12.24 24.7711 12.66 24.0534 13.12 23.6433C9.56 23.2332 5.84 21.8183 5.84 15.5435C5.84 13.7594 6.46 12.283 7.48 11.1347C7.32 10.7246 6.76 9.04309 7.64 6.78745C7.64 6.78745 8.98 6.35682 12.04 8.46893C13.32 8.09982 14.68 7.91527 16.04 7.91527C17.4 7.91527 18.76 8.09982 20.04 8.46893C23.1 6.33632 24.44 6.78745 24.44 6.78745C25.32 9.04309 24.76 10.7246 24.6 11.1347C25.62 12.283 26.24 13.7389 26.24 15.5435C26.24 21.8388 22.5 23.2332 18.94 23.6433C19.52 24.1559 20.02 25.1402 20.02 26.6781C20.02 28.8723 20 30.6358 20 31.1894C20 31.6201 20.3 32.1327 21.1 31.9687C24.2765 30.8695 27.0367 28.7766 28.9921 25.9846C30.9474 23.1925 31.9994 19.842 32 16.4047C32 7.3411 24.84 0 16 0Z" fill="#171515"/>
          </svg>`
				socialLinks.appendChild(githubEl)
			}
		}

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
	} catch (error) {
		chainId = null

		try {
			if (ethereum) {
				if (error.message.includes('Already processing eth_requestAccounts')) {
					errorMsg.innerHTML = 'You\ll need to unlock MetaMask and refresh the page to use GweiFundMe.'
				} else {
					errorMsg.innerHTML = error.message
				}
			}
		} catch (error) {
			errorMsg.innerHTML = "You'll need MetaMask to use GweiFundMe."
		}
	}

	let tokenValue

	if (chainId === 1 || chainId === null) {
		// Show USD value of ETH
		tokenValue = ethPrice
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
