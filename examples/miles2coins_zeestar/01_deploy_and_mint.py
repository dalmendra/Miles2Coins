#01_deploy_and_mint.py

import time  # For measuring execution time and printing timestamps

# 1) Create dummy accounts: Owner, Alice, Bob
print("Command: owner, alice, bob = create_dummy_accounts(3)")
start_time = time.time()
owner, alice, bob = create_dummy_accounts(3)
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds\n")

# 2) Deploy the contract as Owner
print("Command: miles2coins = deploy(user=owner)")
start_time = time.time()
miles2coins = deploy(user=owner)
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds\n")

# 3) Connect Owner, Alice, Bob to the deployed contract
print("Command: owner_interface = connect(miles2coins.address, user=owner)")
start_time = time.time()
owner_interface = connect(miles2coins.address, user=owner)
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds\n")

print("Command: alice_interface = connect(miles2coins.address, user=alice)")
start_time = time.time()
alice_interface = connect(miles2coins.address, user=alice)
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds\n")

print("Command: bob_interface = connect(miles2coins.address, user=bob)")
start_time = time.time()
bob_interface = connect(miles2coins.address, user=bob)
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds\n")

# 4) Mint tokens: 20,000 Miles for Alice, 40,000 Surreal for Bob
print("Command: owner_interface.mintMiles(alice, 20000)")
start_time = time.time()
owner_interface.mintMiles(alice, 20000)
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds\n")

print("Command: owner_interface.mintSurreal(bob, 40000)")
start_time = time.time()
owner_interface.mintSurreal(bob, 40000)
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds\n")

# 5) Check initial balances
print("Command: alice_miles_balance = alice_interface.getMilesBalance()")
start_time = time.time()
alice_miles_balance = alice_interface.getMilesBalance()
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds")
print(f"Alice's MilesTokens: {alice_miles_balance}\n")

print("Command: alice_surreal_balance = alice_interface.getSurrealBalance()")
start_time = time.time()
alice_surreal_balance = alice_interface.getSurrealBalance()
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds")
print(f"Alice's SurrealCoins: {alice_surreal_balance}\n")

print("Command: bob_miles_balance = bob_interface.getMilesBalance()")
start_time = time.time()
bob_miles_balance = bob_interface.getMilesBalance()
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds")
print(f"Bob's MilesTokens: {bob_miles_balance}\n")

print("Command: bob_surreal_balance = bob_interface.getSurrealBalance()")
start_time = time.time()
bob_surreal_balance = bob_interface.getSurrealBalance()
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds")
print(f"Bob's SurrealCoins: {bob_surreal_balance}\n")