import webWallet from "libs/web-wallet";
import abi from "ethjs-abi";
import server from "libs/server";
import sha256 from "js-sha256";
import config from "libs/config";

// Setting up Web3
const web3 = webWallet.getWallet()
const ABI = JSON.parse(
  '[{"constant":false,"inputs":[{"name":"_postId","type":"uint256"},{"name":"_text","type":"string"}],"name":"newComment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"posts","outputs":[{"name":"text","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"commentFromAccount","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_text","type":"string"}],"name":"newPost","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hasPosts","outputs":[{"name":"_hasPosts","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"comments","outputs":[{"name":"text","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"postsFromAccount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"commentsFromPost","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"postId","type":"uint256"},{"indexed":false,"name":"commentId","type":"uint256"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewPostAdded","type":"event"}]'
)
  const contractAddress =  config.getNetwork() == "mainnet" ? "4a79ad8dc23d17944fdc3dc9a9e8a7946d6df0d4" : "4a79ad8dc23d17944fdc3dc9a9e8a7946d6df0d4"

  // Instantiate contractw
  this._contract = new web3.eth.Contract(ABI, contractAddress)

  // Creating message queues
  const newPostQueue = new Queue('newPost')
  const newCommentQueue = new Queue('newComment')

  // Listen from post from smart contract
  this._contract.events.NewPostAdded({}, async (err, event) => {
    // Push to message queue
    if (event.returnValues.commentId === '0') {
      event.returnValues.text = await this._contract.methods.posts(event.returnValues.postId).call({from})
      newPostQueue.createJob(event.returnValues).save()
    } else {
      event.returnValues.text = await this._contract.methods.comments(event.returnValues.commentId).call({from})
      newCommentQueue.createJob(event.returnValues).save()
    }
  })

  // Processing posts
  newPostQueue.process(async (job, done) => {
    // Push to ElasticSearch
    await request({
      method: 'POST',
      uri: 'http://localhost:9200/socialnetwork_posts/app',
      body: job.data,
      json: true
    })

    return done(null, true)
  })

  // Processing comments
  newCommentQueue.process(async (job, done) => {
    // Push to ElasticSearch
    await request({
      method: 'POST',
      uri: 'http://localhost:9200/socialnetwork_comments/app',
      body: job.data,
      json: true
    })

    return done(null, true)
  })

  // Create a basic read only API for expose posts and comments
  http.createServer(async (req, res) => {
    let url

    if (req.url === '/posts') {
      url = 'http://localhost:9200/socialnetwork_posts/_search'
    } else if (req.url == '/comments') {
      url = 'http://localhost:9200/socialnetwork_comments/_search'
    } else {
      // Type not indexed on ElasticSearch
      console.warn(`Request type ${req.url} not indexed`)
    }

    let ecResult
    try {
      res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
      ecResult = await request(url)
      res.write(ecResult)
    } catch (err) {
      res.writeHead(404, {'Access-Control-Allow-Origin': '*'})
    }

    res.end()
  }).listen(8081)

  console.log('Listen on 8081')
})()
