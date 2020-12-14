enum PropertyValueRelation {
	// these values also used as part of message keys and
	// so any changes made to this enum have to also be reflected in en.json and qqq.json
	Matching = 'matching',
	NotMatching = 'without',
	Regardless = 'regardless-of-value',
}

export default PropertyValueRelation;
