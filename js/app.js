// Declare the function constructor
function TFIDF() {
   // Set default value
   this.tags = {};
   this.totalWords = 0;
   this.keys = [];
}


// This is where the preprocessing of the data occurs
TFIDF.prototype.preProcessing = function (tokens) {
   tokens = tokenize(tokens);
   tokens = removeStopWords(tokens);
   tokens = stemmer(tokens);
   return tokens;
}


// Get the term frequency of each token
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  getTermFrequency()                                                              *
 *  this function takes the preprocess tokens and then check if it can be added by  *
 *  calling the addTerm() function. It also count the total no. of words in a post  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
TFIDF.prototype.getTermFrequency = function (tokens) {
   tokens = this.preProcessing(tokens);
   for (let i = 0; i < tokens.length; i++) {
      this.addTerm(tokens[i]);
      this.totalWords++;
   }
}


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
TFIDF.prototype.calculateTFIDF = function (current, otherDocs) {
   this.getTermFrequency(current);
   this.getDocumentFrequency(otherDocs);
   let tags = this.tags;
   let keys = this.keys;
   for (let i = 0; i < this.keys.length; i++) {
      let tf = tags[keys[i]].count / this.totalWords;
      let idf = Math.log(otherDocs.length / tags[keys[i]].docCount);
      tags[keys[i]].tfidf = tf * idf;
   }
}

TFIDF.prototype.getTFIDF = function (term) {
   return this.tags[term].tfidf;
}  

TFIDF.prototype.getKeys = function () {
   return this.keys;
}

TFIDF.prototype.sortByScore = function () {
   var tfidf = this;
   this.keys.sort(function (a, b) {
      return (tfidf.getTFIDF(b) - tfidf.getTFIDF(a));
   });
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




const submitBtn = document.getElementById("keywordBtn");
submitBtn.addEventListener("click", generateTags);


function generateTags() {
   $("#keywordModal").modal();
   let tfidf = new TFIDF();
   let allPosts = '["{}"]';
   if(document.getElementById("postJSON").hasChildNodes()){
      allPosts = JSON.parse(document.getElementById("postJSON").textContent);
   }

   console.log(allPosts);

   let currentPost = document.getElementById("title").value + ' ' + document.getElementById("body").value;

   tfidf.calculateTFIDF(currentPost, allPosts);
   console.log(tfidf);
   tfidf.sortByScore();

   let keys = tfidf.getKeys();
   for (let i = 0; i < 5; i++) {
      $("#keywordBody").append(`<label class="btn btn-primary active">
                                       <input type = "checkbox" autocomplete="off" name="tags[]" value=${keys[i]} checked>${keys[i]}
                                    </label>`);
   }
   document.getElementById("keywords").value = JSON.stringify(tfidf);
}