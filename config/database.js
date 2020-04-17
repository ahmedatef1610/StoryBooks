if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: `mongodb+srv://ahmed:1610@cluster0-rrcal.mongodb.net/storybooks`}
  } else {
    module.exports = {mongoURI: 'mongodb://localhost/storybooks'}
  }