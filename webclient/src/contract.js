export default class Contract {
  constructor() {
    this.ready = false
  }

    const ABI = [{"constant":false,"inputs":[{"name":"_postId","type":"uint256"},{"name":"_text","type":"string"}],"name":"newComment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"posts","outputs":[{"name":"text","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"commentFromAccount","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_text","type":"string"}],"name":"newPost","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hasPosts","outputs":[{"name":"_hasPosts","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"comments","outputs":[{"name":"text","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"postsFromAccount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"commentsFromPost","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"postId","type":"uint256"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewPostAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"postId","type":"uint256"},{"indexed":false,"name":"commentId","type":"uint256"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewCommentAdded","type":"event"}]

    const contractAddress = CONTRACT ADDRESS

    this._contract = new web3.eth.Contract(ABI, contractAddress, {from})
    this.ready = true
  }

  async newPost(text) {
    return await this._contract.methods.newPost(text).send()
  }

  async newComment(postId, text) {
    return await this._contract.methods.newComment(postId, text).send()
  }

  async hasPosts() {
    return await this._contract.methods.hasPosts().call()
  }

  async getPosts(index) {
    return await this._contract.methods.posts().call()
  }
}
