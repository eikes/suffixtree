
function createCode(){
var text = document.getElementById("lyrics").value;
var root, substring, letter, j;
var usedletters = [];
var unusedletters = [];
var compressedletters = [];

// generate an array of all possible letters:
for (var i = 32; i <= 126; i++) {
  unusedletters.push(String.fromCharCode(i));
}

// find unused letters, they can be used for replacements later on
text.split("").map(function(value) {
  if (usedletters.indexOf(value) == -1) {
    usedletters.push(value);
  }
  j = unusedletters.indexOf(value);
  if (j != -1) {
    unusedletters.splice(j, 1);
  }
});

// make it html friendly:
unusedletters.splice(unusedletters.indexOf("\""),1);
unusedletters.splice(unusedletters.indexOf("'"),1);
unusedletters.splice(unusedletters.indexOf("`"),1);
unusedletters.splice(unusedletters.indexOf("'"),1);
unusedletters.splice(unusedletters.indexOf("<"),1);
unusedletters.splice(unusedletters.indexOf(">"),1);
unusedletters.splice(unusedletters.indexOf("/"),1);
unusedletters.splice(unusedletters.indexOf("\\"),1);

// turn Newlines into html <br>, this changes the lyrics, 
// but it's nice in the end to view it in a browser
letter = unusedletters.pop();
text = text.replace(/\n/g, letter);
text = text + letter + "<br>";
compressedletters.push(letter);

while (unusedletters.length) {
  // Crete a new SuffixTree from the current text
  root = new SuffixTree(text);
  // Get the longest repeated substring
  substring = root.node.getLongestRepeatedSubString();
  // If the substring is too short, nothing is gained by substitution
  if (substring.length == 4) break;
  // get a new letter for substitution
  letter = unusedletters.pop();
  // replace all occurences of the substring with the letter
  while (text.indexOf(substring) != -1) {
    text = text.replace(substring, letter);
  }
  // append the letter and the substring for decompression
  text = text + letter + substring;
  // remember the letter
  compressedletters.push(letter);
}

compressedletters = compressedletters.join("");

/////////////////////////////////////////////
// Create code
/////////////////////////////////////////////
code = 
  't="' + text + '";' +
  'c="' + compressedletters + '".split("");' +
  "while(l=c.pop()){" +
    "t=t.split(l);" + 
    "t=t.join(t.pop())" + 
  "}" + 
  "document.write(t)";
  // + "alert(t)";

document.getElementById("code").innerHTML = code.replace(/>/g, "&gt;").replace(/</g, "&lt;");
document.getElementById("length").innerHTML = code.length;
}

document.getElementById("eval").onclick = function(){
  document.getElementById("uncompressed").innerHTML = eval(code);
}

createCode();

document.getElementById("newcode").onclick = createCode;
