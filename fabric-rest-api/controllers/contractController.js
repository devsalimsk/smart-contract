const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function invokeContract(req, res) {
    try {
        const ccpPath = path.resolve(__dirname, '..', 'network', 'connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'network', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: process.env.ADMIN_IDENTITY,
            discovery: { enabled: true, asLocalhost: true },
        });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('mycontract'); 

        const result = await contract.evaluateTransaction('myFunction', req.body.param);

        res.json({ result: result.toString() });
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).json({ error: error.toString() });
    }
}

module.exports = { invokeContract };
