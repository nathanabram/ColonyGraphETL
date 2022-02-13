const { request, gql, GraphQLClient } = require("graphql-request");
const fs = require("fs");
const returnQueries = require("./queries.js");
const endpoint =
	"https://xdai.colony.io/graph/subgraphs/name/joinColony/subgraph";

const requestData = async (desiredData, skip = 0) => {
	let querys = returnQueries(skip);
	let query = querys[desiredData];

	let response = await request(endpoint, query);
	console.log(response);
	return response;
};

module.exports = requestData;
