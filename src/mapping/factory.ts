import {WalletFactory, Wallet} from "../../generated/schema"
import {WalletCreated} from "../../generated/WalletFactory/WalletFactory"
import {getSummary} from "../entities"
import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { WalletTemplate, OldWallet } from '../../generated/templates'

export function onWalletCreated(event: WalletCreated): void {
    let factory = WalletFactory.load(event.transaction.from.toHex());
    if(factory == null) {
        factory = new WalletFactory(event.transaction.from.toHex());
        factory.save()
    }
    let wallet = new Wallet(event.params.wallet.toHex());
    wallet.factory = event.transaction.from.toHex()
    wallet.balance = BigInt.fromI32(0)
    wallet.save()

    // for template
    WalletTemplate.create(event.params.wallet);
    OldWallet.create(event.params.wallet);
    
    var summary = getSummary()
    summary.walletCount = summary.walletCount.plus(BigInt.fromI32(1))
    summary.save()
}