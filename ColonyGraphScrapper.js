const fs = require("fs");
const { setPriority } = require("os");
const requestData = require("./GQLqueryMaker");

/* 
a list of data types which can be queried:
	colonies
	domains
	payments
	oneTxPayments
	tokens
	fundingPots
	transactions
	blocks
	events
	colonyExtensions
	motions
	coinMachinePeriods

Create an array of each of these, and for each one, fetch all the available data
*/

const fetchAll = async (dataType, step = 1000) => {
	let data = [];
	let moreToFetch = true;
	let skip = 0;
	while (moreToFetch) {
		let fetched = [];
		// while data is still being returned
		try {
			fetched = await requestData(dataType, skip);
			fetched = fetched[dataType];
		} catch (err) {
			console.log(err);
		}

		if (fetched.length == 0 || fetched == undefined) {
			moreToFetch = false;
		} else {
			data = data.concat(fetched); // merge the arrays
		}
		skip += step; // increase so that the query fetches the next chunk of data
	}
	fs.writeFileSync(`./data/${dataType}`, JSON.stringify(data));
	return data;
};

fetchAll("colonies");
