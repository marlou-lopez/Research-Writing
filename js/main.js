import synonym from './node_modules/synonyms/index.js';
class TFIDF {
	constructor() {
		this.tag = {};
		this.keys = [];
		this.totalWords = 0;
	}

	getTermFrequency(text) {
		var tokens = tokenize(text);
		tokens = removeStopWords(tokens);
		tokens = stemmer(tokens);
		tokens = syncheck(tokens);
		//tokens = tokens.filter(String);
		for (var i = 0; i < tokens.length; i++) {
			this.addToken(tokens[i]);
			this.totalWords++;
		}
	}

	getDocumentFrequency(data) {
		var tokens = tokenize(data);
		tokens = removeStopWords(tokens);
		tokens = stemmer(tokens);
		//tokens = syncheck(tokens);
		//tokens = tokens.filter(String);
		var tempTag = {};
		for (var i = 0; i < tokens.length; i++) {
			if (tokens[i] && tempTag[tokens[i]] === undefined) {
				tempTag[tokens[i]] = true;
			}
		}

		for (var i = 0; i < this.keys.length; i++) {
			var key = this.keys[i];
			if (tempTag[key]) {
				this.tag[key].docCount++;
			}
		}
	}

	addToken(token) {
		if (this.tag[token] == undefined) {
			this.tag[token] = {};
			this.tag[token].count = 1;
			this.tag[token].docCount = 1;
			this.tag[token].term = token;
			this.keys.push(token);
		} else {
			this.tag[token].count++;
		}
	}

	calculateTFIDF(totalDocs) {
		for (var i = 0; i < this.keys.length; i++) {
			var key = this.keys[i];
			var term = this.tag[key];
			var tf = term.count / this.totalWords;
			var idf = Math.log(totalDocs / term.docCount);
			term.tfidf = tf * idf;
		}
	}

	getKeys() {
		return this.keys;
	}

	getTFIDF(term) {
		return this.tag[term].tfidf;
	}

	sortByScore() {
		var tfidf = this;
		this.keys.sort(function (a, b) {
			return (tfidf.getTFIDF(b) - tfidf.getTFIDF(a));
		});
	}
}

$(function () {
	
	$('#keywordBtn').click(function () {
			$('#keywordModal').modal();
			generateKeyword();
	});
	
});

var generateKeyword = (function () {
	// var spinner = $('#loader');
	// spinner.show();
	var executed = false;
	return function () {
		if (!executed) {
			executed = true;
			//var post = $.trim($("#title").val()) + ' ' + $.trim(editor.getData());
			//console.log($('#body').val());
			//var post = $.trim($("#post-title").val()) + ' ' + $('textarea.post-body').val();
			var post = $.trim($("#title").val()) + ' ' + $('#body').val();
			//console.log(post);
			var postsTable = document.getElementById("postsTable");
			var rowVal = [];
			var rowLength = postsTable.rows.length; 
			for (var i = 0; i < rowLength; i++) {
				rowVal[i] = postsTable.rows[i].innerHTML;
			}
			var tfidf = new TFIDF();
			tfidf.getTermFrequency(post);

			for (var i = 0; i < rowLength; i++) {
				tfidf.getDocumentFrequency(rowVal[i]);
			}
			tfidf.calculateTFIDF(rowLength);
			tfidf.sortByScore();

			var keys = tfidf.getKeys();

			for (var i = 0; i < keys.length; i++) {
				if (tfidf.getTFIDF(keys[i]) > 0.035) {
					$("#keywordBody").append(`<label class="btn btn-primary active">
                                             <input type = "checkbox" autocomplete="off" name="tags[]" value=${keys[i]} checked>${keys[i]}
                                                   </label>
                                             `);
				}
			}
		//spinner.hide();
			console.log(tfidf);
		}
	}
})();

function tokenize(text) {
	for (var i = 0; i < text.length; i++) {
		text = text.toLowerCase();
	}
	//console.log(text.replace(/<[^>]*>|\d/g, "").split(/\W+/));
	return text.replace(/<[^>]*>|\d/g, "").split(/\W+/);
	// replace(/[^a-zA-Z ]/g, "").
}

function removeStopWords(text) {
		const stopwords = ["i", "a", "s","t","m","about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "another", "any", "anyhow", "anyone", "anything", "anyway", "anywhere", "are", "around", "as", "at", "back", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom", "but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven", "else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own", "part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"];
	var filteredToken = text.filter(function (element) {
		return stopwords.indexOf(element) === -1;
	}).filter(String);
	return filteredToken;
}

function stemmer(text) {
let vowels = ['a','e','i','o','u'];
let stem = text.map((t) => {
        if(t.endsWith('s')){
            if(t.endsWith('ss')){
                if(t.endsWith('less')){
                    return t.substring(0,t.length-4);
                }
                return t;
            }
            if(t.endsWith('es')){
                if(t.substring(t.length-4,t.length-3) === 's'){
                    return t.substring(0,t.length-2);
                }
                if(t.endsWith('ies')){
                    return t.substring(0,t.length-3) + 'y';
                }
            }
            return t.substring(0,t.length-1);
        }
        if(t.endsWith('ly')){
            if(t.length <= 6) return t;
            if(t.endsWith('ily')){
                return t.substring(0,t.length-3) + 'y';
            }
            if(t.endsWith('fully')){
                return t.substring(0,t.length-5);
            }
            return t.substring(0,t.length-2);
        }
        if(t.endsWith('ed')){
            if(t.endsWith('ied')){
                if(t.length <= 4){
                    return t.substring(0,t.length-1);   
                }
                return t.substring(0,t.length-3) + 'y';
            }
            if(t.length <= 5) return t;
            if(t.charAt(t.length-4) === t.charAt(t.length-3)){
                return t.substring(0,t.length-3);
            }
            if(vowels.includes(t.charAt(t.length-4))){
                return t.substring(0,t.length-1);
            }
            return t.substring(0,t.length-2);
        }
        if(t.endsWith('ful')){
            if(t.length <= 5) return t;
            return t.substring(0,t.length-3);
        }
        if(t.endsWith('ible')){
            if(t.length <= 5) return t;
            return t.substring(0,t.length-4) + 'ibility';
        }
        if(t.endsWith('able')){
            if(t.length <= 5) return t;
            if(t.charAt(t.length-5) === 'e'){
                return t.substring(0,t.length-4);
            }
            return t.substring(0,t.length-4) + 'ability';
		  }
		  return t;
	 });
	 return stem;
}

function syncheck(text){
	let tokens = text;
	console.log(text);
	let temp = [];
	let syn = [];
	for(let i = 0; i < text.length; i++){
		if(synonym(tokens[i]) == undefined){
			//console.log(tokens[i]);
			continue;
		}
		
		syn = synonym(tokens[i]);
		syn.n = syn.n || ''; syn.v = syn.v || ''; syn.s = syn.s || '';
		syn = [...new Set([...syn.n, ...syn.v, ...syn.s])];
		//console.log(tokens[i] + ': '+syn);
		syn = syn.splice(1,syn.length-1);
		temp = tokens.map((t) => {
			if(syn.includes(t)){
				t = tokens[i];
			}
			return t;
		});
		tokens = temp;
	}
	console.log(tokens);
	//console.log(temp);
	return tokens;
}
