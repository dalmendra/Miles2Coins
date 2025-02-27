#03_check_balances.py

import time

# Check final balances after all 10 offers
print("Command: alice_miles_balance = alice_interface.getMilesBalance()")
start_time = time.time()
alice_miles_balance = alice_interface.getMilesBalance()
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds")
print(f"Alice's MilesTokens (final): {alice_miles_balance}\n")

print("Command: alice_surreal_balance = alice_interface.getSurrealBalance()")
start_time = time.time()
alice_surreal_balance = alice_interface.getSurrealBalance()
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds")
print(f"Alice's SurrealCoins (final): {alice_surreal_balance}\n")

print("Command: bob_miles_balance = bob_interface.getMilesBalance()")
start_time = time.time()
bob_miles_balance = bob_interface.getMilesBalance()
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds")
print(f"Bob's MilesTokens (final): {bob_miles_balance}\n")

print("Command: bob_surreal_balance = bob_interface.getSurrealBalance()")
start_time = time.time()
bob_surreal_balance = bob_interface.getSurrealBalance()
elapsed_time = time.time() - start_time
print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds")
print(f"Bob's SurrealCoins (final): {bob_surreal_balance}\n")