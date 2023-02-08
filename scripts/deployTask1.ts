import { toNano } from 'ton-core';
import { Task1 } from '../wrappers/Task1';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const task1 = Task1.createFromConfig(await compile('Task1'));

    await provider.deploy(task1, toNano('0.05'));

    //const openedContract = provider.open(task1);

    // run methods on `openedContract`
}
