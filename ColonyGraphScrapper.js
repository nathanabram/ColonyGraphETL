const fs = require("fs");
const { setPriority } = require("os");
const requestData = require("./GQLqueryMaker");

// a list of data types which can be queried
const dataTypes = [
	"colonies",
	"domains",
	"payments",
	"oneTxPayments",
	"tokens",
	"fundingPots",
	"transactions",
	"blocks",
	"events",
	"colonyExtensions",
	"motions",
	"coinMachinePeriods",
];

// function to fetch all of a given datatype
const fetchAll = async (dataType, cursors = {}, step = 1000) => {
	let cursor = 0;
	if (cursors) {
		cursor = cursors[dataType] || 0;
	}
	let data = [];
	let moreToFetch = true;
	while (moreToFetch) {
		let fetched = [];
		// while data is still being returned
		try {
			fetched = await requestData(dataType, cursor);
			fetched = fetched[dataType];
		} catch (err) {
			console.log(err);
		}

		if (fetched.length == 0 || fetched == undefined) {
			moreToFetch = false;
		} else {
			data = data.concat(fetched); // merge the arrays
		}
		cursor += step; // increase so that the query fetches the next chunk of data
	}
	let newCursors = cursors;
	newCursors[dataType] = cursor - step; // go back to the last complete fetch, since fetch from cursor didn't have data yet
	fs.writeFileSync("./data/cursors.json", JSON.stringify(newCursors));
	fs.writeFileSync(`./data/${dataType}`, JSON.stringify(data));
	return data;
};

let cursors = {};
try {
	cursors = JSON.parse(fs.readFileSync("./data/cursors.json"));
} catch {
	cursors = {};
}

// for each datatype, execute fetchAll
dataTypes.forEach((dataType) => {
	fetchAll(dataType, cursors);
});
