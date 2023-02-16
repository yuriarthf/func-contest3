import { Blockchain, OpenedContract, TreasuryContract } from '@ton-community/sandbox';
import { Cell, toNano, beginCell } from 'ton-core';
import { Task1 } from '../wrappers/Task1';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { randomInt } from 'crypto';

describe('Task1', () => {
    let blockchain: Blockchain;
    let deployer: OpenedContract<TreasuryContract>;
    let code: Cell;
    let task1: OpenedContract<Task1>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        code = await compile('Task1');
    });

    it('should deploy', async () => {
        task1 = blockchain.openContract(Task1.createFromConfig(code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task1.address,
            deploy: true,
        });
    });

    it('should decompose big cell', async () => {
        // generate random destination address
        const destAddr = beginCell()
            .storeUint(randomInt(5000), 256)
        .endCell().beginParse();

        // big cell to be depomposed
        const bigCell = (beginCell()
            .storeUint(1, 8)
            .storeRef(beginCell()
                .storeUint(2, 8)
                .storeUint(3, 8)
                .storeRef(beginCell()
                    .storeUint(4, 8)
                .endCell())   
                .storeRef(beginCell()
                    .storeUint(2, 8)
                .endCell())
            .endCell())
        .endCell());

        console.log(await task1.getDecomposite(bigCell, destAddr));
    });
});
