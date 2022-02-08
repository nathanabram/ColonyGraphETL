const { request, gql, GraphQLClient } = require("graphql-request");
const fs = require("fs");
const endpoint =
	"https://xdai.colony.io/graph/subgraphs/name/joinColony/subgraph";

const requestData = async (skip = 0) => {
	let query = gql`
    {
  colonies(orderBy: colonyChainId, orderDirection: desc, first: 1000, skip: ${skip}) {
    id
    ensName
    orbitAddress
    colonyChainId
    token {
      tokenAddress: id
      decimals
      symbol
      __typename
    }
    domains
     {
      id
    }
  	metadata
    metadataHistory {
      id
    }
    extensions{
      id
    }
    
  }
}`;

	let response = await request(endpoint, query);
	console.log(response);
	return response;
};

// uses the query defined above to fetch all transactions matching this query between the blocks specified.
// includes a step variation feature, which changes the range based on the density of results, to efficiantly fetch data while complying with rate limits.
const findAllArweaveTxs = async (
	startBlock,
	endBlock,
	initialStep,
	writeToFile = false
) => {
	let step = initialStep;
	let results = [];

	currentBlock = startBlock;
	while (currentBlock < endBlock) {
		console.log("\n\n\n Current Block is ", currentBlock);
		await requestData(currentBlock, step).then((data) => {
			let numberOfResults = Object.keys(data).length;
			if (numberOfResults == 100 && step != 1) {
				step = step / 10; // change to a smaller step
				currentBlock = currentBlock - step; // rewind to the previous block (accounting for end of while loop where step is added back)
				console.log("Changed Step to ", step);
			} else if (numberOfResults < 10 && step < initialStep) {
				step = step * 10; // speed up the parsing
				console.log("Changed Step to ", step);
			} else {
				results = results.concat(data);
			}
		});

		currentBlock += step;
	}
	if (writeToFile) {
		let jsonData = JSON.stringify(results);
		fs.writeFileSync(`blocks_${startBlock}_to_${endBlock}.json`, jsonData);
	}
	return results;
};

// first Arweave transaction is at 559678, 751000 is where they start to get dense
// steps should be a multiple of 10

requestData();
module.exports = { findAllArweaveTxs };
