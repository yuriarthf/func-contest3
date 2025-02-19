import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode, Slice,
    TupleBuilder,
    Dictionary,
} from 'ton-core';

export type Task1Config = {};

export function task1ConfigToCell(/** config: Task1Config **/): Cell {
    return beginCell()
        .storeUint(0, 8)
        .storeDict(Dictionary.empty())
    .endCell();
}

export class Task1 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task1(address);
    }

    static createFromConfig(/** config: Task1Config ,**/ code: Cell, workchain = 0) {
        const data = task1ConfigToCell(/** config **/);
        const init = { code, data };
        return new Task1(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell().endCell(),
        });
    }

    async sendInternal(provider: ContractProvider, via: Sender, value: bigint, body: Cell) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body
        });
    }

    async getData(provider: ContractProvider) {
        return Cell.fromBoc(((await provider.getState()).state as { data: Buffer }).data);
    }

    async getDecomposite(provider: ContractProvider, bigCell: Cell, destinationAddress: Slice) {
        const tupleArgs = new TupleBuilder();
        tupleArgs.writeCell(bigCell);
        tupleArgs.writeSlice(destinationAddress);
        const result = await provider.get("decomposite", tupleArgs.build());
        return result.stack.readTuple();
    }
}
