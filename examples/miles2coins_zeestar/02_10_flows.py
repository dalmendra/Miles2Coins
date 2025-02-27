#02_10_flows.py

import time

# Executes 10 complete flows (placeOffer, listOffers, acceptOffer)
for i in range(1, 11):
    # 1) Alice places an offer (1000 Miles, price=2 => total=2000 Surreal)
    print(f"--- Offer #{i} ---")
    print("Command: alice_interface.placeOffer(1000, 2, 0)")
    start_time = time.time()
    alice_interface.placeOffer(1000, 2, 0)
    elapsed_time = time.time() - start_time
    print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds\n")

    # 2) Bob lists all offers
    print("Command: bob_interface.listOffers(2)")
    start_time = time.time()
    bob_interface.listOffers(2)
    elapsed_time = time.time() - start_time
    print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds\n")

    # 3) Bob gets last offer ID
    print("Command: last_offer_id = bob_interface.state.get_plain('last_offer_id')")
    start_time = time.time()
    last_offer_id = bob_interface.state.get_plain('last_offer_id')
    elapsed_time = time.time() - start_time
    print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds")
    print(f"Last Offer ID: {last_offer_id}\n")

    # 4) Bob accepts the newly created offer
    print("Command: bob_interface.acceptOffer(last_offer_id)")
    start_time = time.time()
    try:
        bob_interface.acceptOffer(last_offer_id)
        elapsed_time = time.time() - start_time
        print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds")
        print("Offer accepted successfully.\n")
    except Exception as e:
        elapsed_time = time.time() - start_time
        print(f"Start time: {time.ctime(start_time)} ; Time taken: {elapsed_time:.6f} seconds")
        print("Failed to accept the offer. Transaction reverted.")
        print(e)
        print()