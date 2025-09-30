## 🔒 Chapter 29: Bear Prevention Guide - Server Security and Management

My Block Adventurer, after setting up the server, you will face the biggest challenge: **Protect your world from malicious sabotagers ("naughty kids")**. These vandals may blow up buildings, steal items or maliciously harass other players.

As a server administrator, you need to take multiple layers of defense to minimize risks.

------



### 1. Access Control: Who can enter your world?



This is the easiest and most effective defense method to control risks directly from the source.



#### A. Whitelist



- **Function:** Only players you add to the list manually can join the server.
- **operate:** Enter the command `/whitelist add [玩家ID]` in the server console.
- **applicability:** **A must-have feature for a private or small community server.** It can completely block strangers.



#### B. OP permission management



- **Function:** **OP (Operator, Administrator)** permission gives the player the highest permission on the server (for example, use instructions such as `/gamemode`, `/tp`, etc.).
- **in principle:** **OP permissions are only granted to players you trust most and are administrators or technicians.** Never give anyone OP permissions easily.
- **Restrict player permissions:** For ordinary players, they should use any instructions that may destroy the environment (such as `/fill` or `/give`).



### 2. Territory protection: Give players defense capabilities



Territory plug-in is the second line of defense against bears, and it distributes the responsibility for protection to players to protect their property.



#### A. Land Claiming



- **Functional concept:** allows players to circle an area in the world, **Declare sovereignty**.
- **Protection mechanism:** Once the area is enclosed, only **Landlord** or the player authorized by the owner can destroy the block, open the box, or use the equipment in the area.
- **Configuration Limitations:** You should limit each player to limit **Maximum number and size of territory** to prevent someone from occupying too many resources.



#### B. Explosion protection and flow restrictions



- **Explosion-proof mechanism:** Disable or limit the destructive power of certain items and creatures. **Disable the damage to the terrain caused by the explosion of Creeper and Ghast**, but can retain damage to the player.
- **Anti-magma/water flow:** Limit the flow distance between magma and water, preventing players from deliberately using it to destroy other people's buildings.



### 3. Recording and retrieval: Post-accountability and repair



Even with whitelists and territorial protection, destruction can still occur. You need features that can quickly undo the broken ones.



#### A. Block Logging



- **Functional concept:** The server will change the placer, destroyer, destroy time of each block, and the items in the box.
- **effect:** When a corruption is found, the administrator can query which block was destroyed by record-keeping. This is the accountability.



#### B. Rollback



- **Functional concept:** Allows the administrator to **One-click undo** for the destructive behavior of the specified area or the specified player in **Within a certain period of time**.
- **importance:** This is a tool for **Fastest recovery loss** after the server is blown up or stolen, which can greatly reduce losses.



### 4. Community Management: Rules and Supervision



Technical means are the foundation, and community management is the key to ensuring the long-term and stable operation of the server.

- **Clear rules:** In a prominent location of the server (such as birth point or bulletin board) **Clearly list prohibited behaviors** (such as malicious destruction, theft, screen swiping, cheating, etc.).
- **Set up a reporting system:** Set clear **Reporting channels** (such as Discord groups or in-game commands) to allow players to easily report violations.
- **Recruiting trusted management teams:** Select upright and active players to serve as **Moderator** to assist you in daily supervision.

------

By combining **Whitelists, Territory plugins, block records and strict community management**, you can minimize the risk of malicious damage to the server.