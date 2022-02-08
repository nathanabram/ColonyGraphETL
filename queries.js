let queries = {
	colonyQuery: gql`
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
}`,
	//etc
};
