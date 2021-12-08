const { time } = require('@openzeppelin/test-helpers');
const { expect } = require("chai");
const { ethers } = require('hardhat');

const BN = ethers.BigNumber;

const Name = "Test Token";
const Symbol = "TEST";
const Decimals = BN.from(18);
const OneToken = BN.from(10).pow(Decimals);
const moment = require('moment')

describe("Token test", function () {
    let tokenInst, vesting;

    // const inititalSupply = OneToken.mul(100000000);
    // const lockedTotalSupply = OneToken.mul(75000000);

    const inititalSupply = OneToken.mul(500000000);
    const lockedTotalSupply = OneToken.mul(225000000);

    beforeEach(async () => {
        // deploy Token
        const Token = await ethers.getContractFactory("Token");
        tokenInst = await Token.deploy(inititalSupply);
		
		const GhospTokenVesting = await ethers.getContractFactory("CasperPadTokenVesting");
		vesting = await GhospTokenVesting.deploy(tokenInst.address)
		await tokenInst.transfer(vesting.address, lockedTotalSupply)

		const balanceOfContract = await tokenInst.balanceOf(vesting.address)
		console.log("balance of contract is:" + ethers.utils.formatEther(balanceOfContract));
		
    });

    it("Vesting test", async () => {
        const [owner] = await ethers.getSigners();
		let k = 0;
		for(let i = 0; i < 25; i++) {
			const time = await vesting.vestingTimeList(i);
			for(let j = 0; j < 32; j++) {
				const member = await vesting.members(j);
				if (i > 0) k = 1;
				let amount = 0;
				if (i > 6 && j < 29) amount = 0;
				else amount = ethers.utils.formatEther((await vesting.vestingTimeScheduleList(k, member))[0])
				const day = moment.unix(time).format("YYYY-MM-DD")
				console.log(`${day} - ${member} - ${amount}`)
			}
			console.log('\n');
		}
    });

	it("should successfully send tokens to first account", async() => {
		await time.increaseTo(1639094400 + 1);
        const [owner] = await ethers.getSigners();

		await vesting.addAdmin(owner.address)
		await vesting.unlockToken();

		console.log('address: ', owner.address);

		const balance = await tokenInst.balanceOf('0x0C25363022587299510774E036ad078682991256')
		console.log("balance is:" + ethers.utils.formatEther(balance));
	})

	it("should successfully send all tokens", async() => {
		await time.increaseTo(1702166400 + 1);
        const [owner] = await ethers.getSigners();

		await vesting.addAdmin(owner.address)
		for(let i = 0; i < 25; i++) {
			await vesting.unlockToken();
			const balance = await tokenInst.balanceOf('0xca6acD12f8fB7Eb5E5967A5691fF80F5585b6AB7')

		}

		// let balanceList = [];
		let addressList = [
			'0x815BEe06404b43db6958a6C3f5514C34a3BA67f4',
			'0x3D87c6B6642C2eB170edE7916E67dbdDb2B4e880',
			'0xAb54Ac1a31609e5Ef43e3FaFb8aE9e56303980E0',
			'0xF8090e8B05B17BC6bC99B0495AefDAcff59aE95A',
			'0x1c8038Ebb069313dD218E8b5C1e615f15d8229B0',
			'0x67e18eB3ad7F5981D60D9bd250BEE7faB7e6FE6D',
			'0x505Ffa6194f6e443b86F2028b2a97A588c17b962',
			'0x7c17740d3b41B4D838B8f769640184a871662667',
			'0x94F1029fA7338f220adf6c2f238C3D0AbA188Be8',
			'0x5A4AE4b9e6dBBef192412C0Ab83c0F90F4E97350',
			'0x75076A75a263e90782b2968f9a83c34Cd56Ba099',
			'0x369985Df2CC1B0692519f01A923271c86349F989',
			'0xd50391f4728EDcB3799ed7Cfa5bCf7773deEE541',
			'0x632FEf0a5BC417D0D66ED2010774336076a99452',
			'0xe567D9FAf97b4F9F910F9e6913B07c5dE2B37084',
			'0xb15dE4AeB7A84282aa2541A0bdAf44d18D74060f',
			'0xBDdBD07C1783ebF90eDfcA8096e37dCeA04381E2',
			'0xAf94bfe9AC63b11eF7F6106D1FF101693cF2a2d6',
			'0x40Fc79BDAf528263a20054d994CDb750D6568CE9',
			'0x08613433ad0037A0BB8c2217fAA81A0Cfb7d9d47',
			'0x8a8DaE66246a616cE7BF2C279673F32BBf0A92B9',
			'0x09c826E614489a3143476547d554AF7cb51D11AC',
			'0xD21bD3E814231A61f3a1Ed196E10B253583E536c',
			'0x8dc05A396658a90fe71241A13181459C9a87fE45',
			'0xE478Baa3110c016fbf22708abAe74b29E8b9A9ED',
			'0x2373Bb8bF89A82C107D82Bd2d69AebEe4e468FE2',
			'0x9D7908e58160A69B745BDA5314a54840F70071d7',
			'0x0C25363022587299510774E036ad078682991256',
		];
		let total = 0;
		for (let i = 0; i < addressList.length; i++) {
			const balance = await tokenInst.balanceOf(addressList[i])
			// balanceList.push(ethers.utils.formatEther(balance));
			// console.log("balance "+addressList[i]+" is: " + i + ' -- ' + ethers.utils.formatEther(balance));
			total = total + Number(ethers.utils.formatEther(balance));
		}

		console.log("total :" + total);

		const balanceOfContract = await tokenInst.balanceOf(vesting.address)
		console.log("balance of contract is:" + ethers.utils.formatEther(balanceOfContract));
	})

});
