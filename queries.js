const fs = require("fs");
const { request, gql, GraphQLClient } = require("graphql-request");

// used so that custom queries can be returned for a given "skip" value
const returnQueries = (skip) => {
	let queries = {
		colonies: gql`
    {
  colonies(orderBy: colonyChainId, orderDirection: asc, first: 1000, skip: ${skip}) {
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
  	metadata{
      id 
      colony
      transaction {id}
      metadata
    }
    metadataHistory {
      id
    }
    extensions{
      id
    }
  } 
  }`,
		domains: gql`
		{
			domains(orderBy: id, orderDirection: asc, first: 1000, skip: ${skip}){
        id
        domainChainId
        parent {id}
        name
        colonyAddress
        metadata{
          id
          domain
          transaction {id}
          metadata
        }
        metadataHistory {id}
      }
		}
	`,

		payments: gql`{
    payments(orderBy: id, orderDirection: asc, first: 1000, skip: ${skip}){
      id
      domain {id}
      colony {id}
      to
      fundingPot{
        id
      }
      paymentChainId
    }
  }`,
		oneTxPayments: gql`{
    oneTxPayments(orderBy: id, orderDirection: asc, first: 1000, skip: ${skip}){
      id
      fundamentalChainId
      timestamp
      nPayouts
      agent
      transaction {id}
      expenditure
      payment {id}
    }
  }`,
		tokens: gql`{
    tokens(orderBy: id, orderDirection: asc, first: 1000, skip: ${skip}){
      id
      decimals
      symbol
    }
  }`,
		fundingPots: gql`{
    fundingPots(orderBy: id, orderDirection: asc, first: 1000, skip: ${skip}){
      id
      fundingPotPayouts {
        id
        token {id}
        amount
        fundingPotChainId
      }
    }
  }`,

		transactions: gql`{
    transactions(orderBy: id, orderDirection: asc, first: 1000, skip: ${skip}){
      id
      block {id}
    }
  }`,
		blocks: gql`{
    blocks(orderBy: id, orderDirection: asc, first: 1000, skip: ${skip}){
      id
      timestamp
    }
  }`,

		events: gql`{
    events(orderBy: id, orderDirection: asc, first: 1000, skip: ${skip}){
      id
      timestamp
      transaction {id}
      address
      associatedColony {id}
      name
      args
    }
  }`,
		colonyExtensions: gql`{
    colonyExtensions(orderBy: id, orderDirection: asc, first: 1000, skip: ${skip}){
      id
      colony {id}
      hash
    }
  }`,
		motions: gql`{
    motions(orderBy: id, orderDirection: asc, first: 1000, skip: ${skip}){
      id
      fundamentalChainId
      action
      extensionAddress
      associatedColony {id}
      transaction {id}
      agent
      domain {id}
      stakes
      requiredStake
      escalated      
    }
  }`,
		coinMachinePeriods: gql`{
    coinMachinePeriods(orderBy: id, orderDirection: asc, first: 1000, skip: ${skip}){
      id
      saleEndedAt
      colonyAddress
      tokensBought
      price
    }
  }`,
	};

	fs.writeFileSync("colony-graph-queries.json", JSON.stringify(queries));
	return queries;
};

module.exports = returnQueries;
