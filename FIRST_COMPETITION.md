## Proposal

First study a bit through this [Modifying Compressed NFTs](https://www.helius.dev/blog/solana-nft) article by Helius which leads to an [example cNFT GitHub repository](https://github.com/helius-labs/compression-examples)

We can use this repository as a base for some of the functionalities we would use within the competition. Heck, we can legit fork the whole repository.

__Additional links:__
- [Metaplex Bubblegum GH repo](https://github.com/metaplex-foundation/mpl-bubblegum/tree/main/programs/bubblegum)
- [Metaplex Bubblegum documentation](https://developers.metaplex.com/bubblegum)

__Repo specification:__
We want to make a repo that's a runnable node.js server. It might have some CLI commands, `.env` file that needs to be set up before hackers start hacking, prerequisites to participate etc. But mainly, this repository will represent a minimum viable production case of client-side Bubblegum Program use.

__Proposed competition steps/clues:__
- prerequisites: study the Bubblegum docs, attend a workshop, fork the repo, set up the `.env` file or run `npm run setup` which would prepare the environment for you (create a new wallet address and airdrop devnet sol)
- after preparing environment the hacker starts to solve clues in order to reach the goal -> mint the Flag from the Candy Machine

- first in the `main.ts` he notices a `//TODO: fix airdropClue() function`
- hacker then finds the function which has 1-5 faulty lines of code (can be fixed by referencing Metaplex docs
- after the function is fixed, the hacker can run it (maybe via `npm run airdrop-clue` CLI command?
- this will airdrop a cNFT to the wallet specified in the `.env`
- within the cNFT metadata hacker has to notice the address of a new cNFT tree
- hacker then has to burn the clue cNFT that he was airdropped in order to get to mint a cNFT from this new tree
- this newly minted cNFT contains a code that hacker has to type into CLI after running the `npm run mint-flag` command.