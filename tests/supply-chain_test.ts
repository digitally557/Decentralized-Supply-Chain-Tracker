import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Can register a new item",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Set user role first
        let block = chain.mineBlock([
            Tx.contractCall('supply-chain', 'set-user-role', [
                types.principal(wallet1.address),
                types.ascii("manufacturer")
            ], deployer.address)
        ]);
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);
        
        // Register an item
        block = chain.mineBlock([
            Tx.contractCall('supply-chain', 'register-item', [
                types.ascii("item-001"),
                types.utf8("Test Item"),
                types.utf8("A test item for supply chain tracking"),
                types.utf8('{"origin": "test", "batch": "001"}'),
                types.none()
            ], wallet1.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), "item-001");
    },
});

Clarinet.test({
    name: "Quality verification works correctly",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const manufacturer = accounts.get('wallet_1')!;
        const inspector = accounts.get('wallet_2')!;
        
        // Set roles
        let block = chain.mineBlock([
            Tx.contractCall('supply-chain', 'set-user-role', [
                types.principal(manufacturer.address),
                types.ascii("manufacturer")
            ], deployer.address),
            Tx.contractCall('supply-chain', 'set-user-role', [
                types.principal(inspector.address),
                types.ascii("inspector")
            ], deployer.address)
        ]);
        
        // Register item
        block = chain.mineBlock([
            Tx.contractCall('supply-chain', 'register-item', [
                types.ascii("item-quality-001"),
                types.utf8("Quality Test Item"),
                types.utf8("Item for quality testing"),
                types.utf8('{"test": "quality"}'),
                types.none()
            ], manufacturer.address)
        ]);
        
        // Verify quality
        block = chain.mineBlock([
            Tx.contractCall('supply-chain', 'verify-quality', [
                types.ascii("item-quality-001"),
                types.uint(85),
                types.utf8("Quality check passed")
            ], inspector.address)
        ]);
        
        assertEquals(block.receipts[0].result.expectOk().includes("item-quality-001-quality-"), true);
    },
});

Clarinet.test({
    name: "Multi-party approval system works",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const manufacturer = accounts.get('wallet_1')!;
        const approver1 = accounts.get('wallet_2')!;
        const approver2 = accounts.get('wallet_3')!;
        
        // Set roles
        let block = chain.mineBlock([
            Tx.contractCall('supply-chain', 'set-user-role', [
                types.principal(manufacturer.address),
                types.ascii("manufacturer")
            ], deployer.address)
        ]);
        
        // Register item
        block = chain.mineBlock([
            Tx.contractCall('supply-chain', 'register-item', [
                types.ascii("item-approval-001"),
                types.utf8("Approval Test Item"),
                types.utf8("Item for approval testing"),
                types.utf8('{"test": "approval"}'),
                types.none()
            ], manufacturer.address)
        ]);
        
        // Add approvals
        block = chain.mineBlock([
            Tx.contractCall('supply-chain', 'approve-item', [
                types.ascii("item-approval-001"),
                types.utf8("First approval")
            ], approver1.address),
            Tx.contractCall('supply-chain', 'approve-item', [
                types.ascii("item-approval-001"),
                types.utf8("Second approval")
            ], approver2.address)
        ]);
        
        // Check approval status
        const approvalStatus = chain.callReadOnlyFn(
            'supply-chain',
            'get-item-approval-status',
            [types.ascii("item-approval-001")],
            deployer.address
        );
        
        const result = approvalStatus.result.expectTuple();
        assertEquals(result['approval-count'], types.uint(2));
    },
});
