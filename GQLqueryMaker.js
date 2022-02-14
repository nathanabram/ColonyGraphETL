const { request, gql, GraphQLClient } = require("graphql-request");
const fs = require("fs");
const returnQueries = require("./queries.js");
const endpoint =
	"https://xdai.colony.io/graph/subgraphs/name/joinColony/subgraph";

const requestData = async (desiredData, skip = 0, retry = 0) => {
	if (retry > 10) {
		return [];
	}
	let querys = returnQueries(skip);
	let query = querys[desiredData];
	try {
		let response = await request(endpoint, query);
		console.log(response);
		return response;
	} catch {
		setTimeout(() => {
			requestData(desiredData, skip, retry + 1);
		}, 1000 * retry);
	}
};

module.exports = requestData;
