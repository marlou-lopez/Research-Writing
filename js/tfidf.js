import { nounsEndingInS } from './s_nouns.js';

//Declare Funcion Constructor
function TFIDF(tokens,otherDocs){
   // Set default values;
   this.tokens = tokens; 
   this.tags = {};
   this.tempTags = {};
   this.totalWords = 0;
   this.keys = [];
   this.otherDocs = otherDocs;
   this.data = {};
}

//This is where the whole process takes place.
TFIDF.prototype.Process = function () {
   this.tokens = tokenize(this.tokens); // Tokenize the tokens
   this.tokens = removeStopWords(this.tokens); // Remove stopwords from the tokens
   this.tokens = stemmer(this.tokens); // Stem each token -- PROBLEM ONE
   let temp = [];
   let tokens = this.tokens;
   
   // get the frequency of each tag
   this.getTempTermFrequency(tokens);

   console.log("Frequency of each tag: ");
   console.log(this.tempTags);

   console.log("Unsorted tokens :");
   console.log(tokens);

   // Sort the tag object based on the frequency
   let sortedTags = Object.keys(this.tempTags).sort((a,b) => { return this.tempTags[b].count-this.tempTags[a].count});
   
   let sortedTokens = [];
   sortedTags.forEach(key => {
      for(let i = 0; i < this.tempTags[key].count; i++){ // push the tag into the array n times; n = count of that tag;
         sortedTokens.push(key);
      }
   })
   console.log("Sorted tokens based on frequency: ");
   console.log(sortedTokens);
   fetchAllSynonym(sortedTokens) // get the synonyms of each token and then process it.
  .then(synonym => {
      for(let i = 0; i < sortedTokens.length; i++){   //    PROBLEM TWO
          let syn = synonym[i];                       //   This is where the synonym replacement occurs.
          temp = sortedTokens.map(t => {              //   What this process is basically doing is check
              if(syn.includes(t)){                    //   if the current token is present in an array of synonyms of
                  t = sortedTokens[i];                //   another token, if it is present, it replaces the current token
              }                                       //   with the token that we got the array of synonyms from
              return t;                         
          })                                    
          sortedTokens = temp;                        
      }
      console.log("Synonym Checking and Replacement: ");                
      console.log(sortedTokens);                         
      this.getTermFrequency(sortedTokens);   // Get the term frequency of the tokens in the current post.
      this.getDocumentFrequency(this.otherDocs); // Get the document frequency of current post.
      this.calculateTFIDF();  // Calculate the TFIDF of each term
      this.sortByScore(); // Sort the terms in descending order
      return this;
  })
  .then(tfidf => {
      // This is where we display the top 10 terms from the tfidf object
  		let keys = tfidf.getKeys(); 
      for (let i = 0; i < Math.min(keys.length, 10); i++) {
      	$("#keywordBody").append(`<label class="btn btn-primary active">
                                       <input type = "checkbox" autocomplete="off" name="tags[]" value=${keys[i]} checked>${keys[i]}
                                    </label>`);
   	}
      this.data["keys"] = tfidf.keys;
      this.data["tags"] = tfidf.tags;
      this.data["totalWords"] = tfidf.totalWords;

      console.log("Processed Tags: ");
      console.log(this.data);
      document.getElementById("keywords").value = JSON.stringify(this.data); // Display stringified tfidf object to be save in the DB
  })

}

// Get the term frequency of each token
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  getTermFrequency()                                                              *
 *  this function takes the preprocess tokens and then check if it can be added by  *
 *  calling the addTerm() function. It also count the total no. of words in a post  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
TFIDF.prototype.getTermFrequency = function (tokens) {
   for (let i = 0; i < tokens.length; i++) {
      this.addTerm(tokens[i]);
      this.totalWords++;
   }
}

// Temporary TF
TFIDF.prototype.getTempTermFrequency = function (tokens) {
   for (let i = 0; i < tokens.length; i++) {
      this.addTempTerm(tokens[i]);
   }
}

TFIDF.prototype.addTempTerm = function (token) {
   if (this.tempTags[token] == undefined) {
      this.tempTags[token] = {};
      this.tempTags[token].term = token;
      this.tempTags[token].count = 1;
   } else {
      this.tempTags[token].count++;
   }
}
//

// Get the document frequency of the term
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  getDocumentFrequency()                                                          *
 *  this function checks if a the current post's terms/tags are present on          *
 *  the data object, if a term is present, increment the document count (docCount)  *
 *  of that term.                                                                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
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

// Add the term in the 'tags' object
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  addTerm()                                                                       *
 *  If a term already exists in the 'tags' object, increment its count,             *
 *  else add it to the 'tags' object                                                *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
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

// Calculate TFIDF of each term
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *  calculateTFIDF()                                                                *
 *  calculate the TFIDF of each term by multiplying the calculated term frequency   *
 *  with the calculated inverse document frequency                                  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
TFIDF.prototype.calculateTFIDF = function () {
   let tags = this.tags;
   let keys = this.keys;
   for (let i = 0; i < this.keys.length; i++) {
      let tf = tags[keys[i]].count / this.totalWords;
      let idf = Math.log(this.otherDocs.length / tags[keys[i]].docCount);
      tags[keys[i]].tfidf = tf * idf;
   }
}

// get the TFIDF score of a term
TFIDF.prototype.getTFIDF = function (term) {
   return this.tags[term].tfidf;
}  

// get all keys of the tfidf object
TFIDF.prototype.getKeys = function () {
   return this.keys;
}

// sort terms descendingly
TFIDF.prototype.sortByScore = function () {
   var tfidf = this;
   this.keys.sort(function (a, b) {
      return (tfidf.getTFIDF(b) - tfidf.getTFIDF(a));
   });
}


/* * * * * * * * * * * * * *
 *       PROBLEM ONE       *
* * * * * * * * * * * * * */
// Stem the terms in the post 
function stemmer(text) {
   let vowels = ['a', 'e', 'i', 'o', 'u'];
   let stem = text.map((t) => {
      if(!nounsEndingInS.includes(t)){
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
      }
      return t;
   });
   return stem;
}


/* * * * * * * * * * * * * *
 *       PROBLEM TWO       *
* * * * * * * * * * * * * */
// Fetch all of the synonyms
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *  fetchAllSynonym()                                                               *
 *  This function gets all the synonyms of all the tokens in the current post.      *
 *  We use the Datamuse API to get the synonyms.                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
async function fetchAllSynonym(tokens){
    let res = await Promise.all(tokens.map(token => {
        return fetch("https://api.datamuse.com/words?rel_syn="+token+"&max=25")
                .then(r => r.json())
                .then(syn => syn.map(s => s.word));
    }));
    return res;
}

// Tokenize the post
function tokenize(tokens) {
   return tokens.toLowerCase().replace(/<[^>]*>|\d/g, "").split(/\W+/);
}

// Remove stopwords of the post
function removeStopWords(tokens) {
   const stopwords = ["wasn't", "about", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "another", "any", "anyhow", "anyone", "anything", "anyway", "anywhere", "are", "around", "as", "at", "back", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom", "but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven", "else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own", "part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"];

   return tokens.filter(t => {
      return stopwords.indexOf(t) === -1 && t.length > 3;
   }).filter(String);
}


const submitBtn = document.getElementById("keywordBtn");
submitBtn.addEventListener("click", generateTags);

const closeBtn = document.getElementById("keywordCloseBtn");
closeBtn.addEventListener("click",resetModal);

let title = document.getElementById("title");
let body = document.getElementById("body");

function generateTags() {
   $("#keywordModal").modal();
   //console.log(allPosts);
   let currentPost = title.value + ' ' + body.value; // get the current post

   let tfidf = new TFIDF(currentPost,allPosts);
   tfidf.Process();
}

function resetModal(){
   $("#keywordModal").modal('hide');
   $("#keywordBody").empty();
}

