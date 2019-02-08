

let tokens = ["counts","wishes"];
let stem = [];
let vowels = ['a','e','i','o','u'];
stem = tokens.map((t) => {
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
    });
    
console.log(stem);


let tokens = ["test","test","great","good","javascript"];
let temp = [];
for(let i = 0; i < tokens.length; i++){
    
    fetch("https://api.datamuse.com/words?rel_syn="+tokens[i])
		.then(res => res.json())
		.then(data => {
		    let synonym = data.map(syn => syn.word);
		    temp = tokens.map((token) => {
		        if(synonym.includes(token)){
                    token = tokens[i];
		        }
		        return token;   
		    });
		    tokens = temp;
		})
		.catch(err => console.log(err));
}

let post = ["test", "test", "great", "good", "javascript"];
let temp = [];


async function fetchAllSynonym(tokens){
    let res = await Promise.all(tokens.map(token => {
        return fetch("https://api.datamuse.com/words?rel_syn="+token+"&max=5")
                .then(r => r.json())
                .then(syn => syn.map(s => s.word));
    }));
    return res;
}
fetchAllSynonym(post)
.then(synonym => {
    for(let i = 0; i < post.length; i++){
        let syn = synonym[i];
        temp = post.map(p => {
            if(syn.includes(p)){
                p = post[i];
            }
            return p;
        })
        post = temp;
    }
    console.log(post);
})


//------------
function TFIDF(tokens,otherDocs){
	this.tokens = tokens;
  this.tags = {};
  this.totalWords = 0;
  this.keys = [];
  this.otherDocs = otherDocs;
  
}

TFIDF.prototype.preProcessing = function () {
   this.tokens = tokenize(this.tokens);
   this.tokens = removeStopWords(this.tokens);
   this.tokens = stemmer(this.tokens);
   let temp = [];
   let post = this.tokens;
   fetchAllSynonym(post)
  .then(synonym => {
      for(let i = 0; i < post.length; i++){
          let syn = synonym[i];
          temp = post.map(p => {
              if(syn.includes(p)){
                  p = post[i];
              }
              return p;
          })
          post = temp;
      }
      this.getTermFrequency(post);
      this.getDocumentFrequency(this.otherDocs);
      this.calculateTFIDF();
  		console.log(post);
  })

}

TFIDF.prototype.getTermFrequency = function (tokens) {
   for (let i = 0; i < tokens.length; i++) {
      this.addTerm(tokens[i]);
      this.totalWords++;
   }
}

TFIDF.prototype.getDocumentFrequency = function (data) {
   for (let i = 0; i < data.length; i++) {
      if (data[i].keys !== undefined) {
         let tempTag = {};
         for (let j = 0; j < data[i].keys.length; j++) {
            if (data[i].keys[j] && tempTag[data[i].keys[j]] === undefined) {
               tempTag[data[i].keys[j]] = true;
            }
         }
         for (let k = 0; k < this.keys.length; k++) {
            let key = this.keys[k];
            if (tempTag[key] !== undefined) {
               this.tags[key].docCount++;
            }
         }
      }
   }
}

TFIDF.prototype.addTerm = function (token) {
   if (this.tags[token] == undefined) {
      this.tags[token] = {};
      this.tags[token].term = token;
      this.tags[token].count = 1;
      this.tags[token].docCount = 1;
      this.keys.push(token);
   } else {
      this.tags[token].count++;
   }
}

TFIDF.prototype.calculateTFIDF = function () {
   let tags = this.tags;
   let keys = this.keys;
   for (let i = 0; i < this.keys.length; i++) {
      let tf = tags[keys[i]].count / this.totalWords;
      let idf = Math.log(this.otherDocs.length / tags[keys[i]].docCount);
      tags[keys[i]].tfidf = tf * idf;
   }
}


TFIDF.prototype.getTokens = function(){
	return this.tokens;
}

async function fetchAllSynonym(tokens){
    let res = await Promise.all(tokens.map(token => {
        return fetch("https://api.datamuse.com/words?rel_syn="+token+"&max=6")
                .then(r => r.json())
                .then(syn => syn.map(s => s.word));
    }));
    return res;
}

function tokenize(tokens) {
   return tokens.toLowerCase().replace(/<[^>]*>|\d/g, "").split(/\W+/);
}

function removeStopWords(tokens) {
   const stopwords = ["wasn't", "about", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "another", "any", "anyhow", "anyone", "anything", "anyway", "anywhere", "are", "around", "as", "at", "back", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom", "but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven", "else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own", "part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"];

   return tokens.filter(t => {
      return stopwords.indexOf(t) === -1 && t.length > 3;
   }).filter(String);
}

function stemmer(text) {
   let vowels = ['a', 'e', 'i', 'o', 'u'];
   let stem = text.map((t) => {
      if (t.endsWith('s')) {
         if (t.endsWith('ss')) {
            if (t.endsWith('less')) {
               return t.substring(0, t.length - 4);
            }
            return t;
         }
         if (t.endsWith('es')) {
            if (t.substring(t.length - 4, t.length - 3) === 's') {
               return t.substring(0, t.length - 2);
            }
            if (t.endsWith('ies')) {
               return t.substring(0, t.length - 3) + 'y';
            }
         }
         return t.substring(0, t.length - 1);
      }
      if (t.endsWith('ly')) {
         if (t.length <= 6) return t;
         if (t.endsWith('ily')) {
            return t.substring(0, t.length - 3) + 'y';
         }
         if (t.endsWith('fully')) {
            return t.substring(0, t.length - 5);
         }
         return t.substring(0, t.length - 2);
      }
      if (t.endsWith('ed')) {
         if (t.endsWith('ied')) {
            if (t.length <= 4) {
               return t.substring(0, t.length - 1);
            }
            return t.substring(0, t.length - 3) + 'y';
         }
         if (t.length <= 5) return t;
         if (t.charAt(t.length - 4) === t.charAt(t.length - 3)) {
            return t.substring(0, t.length - 3);
         }
         if (vowels.includes(t.charAt(t.length - 4))) {
            return t.substring(0, t.length - 1);
         }
         return t.substring(0, t.length - 2);
      }
      if (t.endsWith('ful')) {
         if (t.length <= 5) return t;
         return t.substring(0, t.length - 3);
      }
      if (t.endsWith('ible')) {
         if (t.length <= 5) return t;
         return t.substring(0, t.length - 4) + 'ibility';
      }
      if (t.endsWith('able')) {
         if (t.length <= 5) return t;
         if (t.charAt(t.length - 5) === 'e') {
            return t.substring(0, t.length - 4);
         }
         return t.substring(0, t.length - 4) + 'ability';
      }
      return t;
   });
   return stem;
}

let keys = { keys: ["great", "nice","accept"] };

let tfidf = new TFIDF("great good",keys);
tfidf.preProcessing();

