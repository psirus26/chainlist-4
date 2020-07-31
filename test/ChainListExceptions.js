//contract to be tested
var ChainList = artifacts.require("./ChainList.sol");

//test suite
contract("ChainList", function(accounts){
    var chainListInstance;
    var seller = accounts[0];
    var buyer = accounts[1];
    var articleName = "article 1";
    var articleDescription = "Description for article 1";
    var articlePrice = 10;

    //no article for sale yet
    it('should throw an exception when buy with no article for sale', function(){
        return ChainList.deployed().then(function(instance){
            chainListInstance = instance;
            return chainListInstance.buyArticle(1,{
                from: buyer,
                value: web3.toWei(articlePrice,"ether")
            });
        }).then(assert.fail)
        //test is expected to fail
        .catch(function(error){
            assert(true);
        }).then(function(){
            //check that the state remains the same
            return chainListInstance.getNumberArticles();
        }).then(function(data){
            //check that the state remains the same
            assert.equal(data.toNumber(),0,"there must be no article for sale");
            // assert.equal(data[0],0x0,"seller must be empty");
            // assert.equal(data[1],0x0,"buyer must be empty");
            // assert.equal(data[2],"","name must be empty");
            // assert.equal(data[3],"","description must be empty");
            // assert.equal(data[4].toNumber(),0,"price must be empty");
        });
    });

    //buy article that does not exist
    it("should throw error when buying article that does not exist", function(){
        return ChainList.deployed().then(function(instance){
            chainListInstance = instance;
            return chainListInstance.sellArticle(
                articleName,
                articleDescription,
                web3.toWei(articlePrice,"ether")
                , {from : seller}
            )
        }).then(function(receipt){
            return chainListInstance.buyArticle(2,{
                from: seller,
                value: web3.toWei(articlePrice,"ether")
            });
        }).then(assert.fail)
        //test is expected to fail
        .catch(function(error) {
            assert(true)
        }).then(function(){
            //check that the state remains the same
            return chainListInstance.articles(1);
        }).then(function(data){
            //check that the state remains the same
            assert.equal(data[0].toNumber(),1,`article id must be 1`);
            assert.equal(data[1],seller,`seller must be ${seller}`);
            assert.equal(data[2],0x0,"buyer must be empty");
            assert.equal(data[3],articleName,`name must be ${articleName}`);
            assert.equal(data[4],articleDescription,`description must be ${articleDescription}`);
            assert.equal(data[5].toNumber(),web3.toWei(articlePrice,"ether"),`price must be ${web3.toWei(articlePrice,"ether")}`);
        });
    });

    //when buying own article
    it("should throw error when buying own article", function(){
        return ChainList.deployed().then(function(instance){
            chainListInstance = instance;
            return chainListInstance.sellArticle(
                articleName,
                articleDescription,
                web3.toWei(articlePrice,"ether")
                , {from : seller}
            )
        }).then(function(receipt){
            return chainListInstance.buyArticle(1,{
                from: seller,
                value: web3.toWei(articlePrice,"ether")
            });
        }).then(assert.fail)
        //test is expected to fail
        .catch(function(error) {
            assert(true)
        }).then(function(){
            //check that the state remains the same
            return chainListInstance.articles(1);
        }).then(function(data){
            //check that the state remains the same
            assert.equal(data[0].toNumber(),1,`article id must be 1`);
            assert.equal(data[1],seller,`seller must be ${seller}`);
            assert.equal(data[2],0x0,"buyer must be empty");
            assert.equal(data[3],articleName,`name must be ${articleName}`);
            assert.equal(data[4],articleDescription,`description must be ${articleDescription}`);
            assert.equal(data[5].toNumber(),web3.toWei(articlePrice,"ether"),`price must be ${web3.toWei(articlePrice,"ether")}`);
        });
    });


    //when buying article at different price than advertised
    it("should throw error when buying article at lower or higher price than advertised", function(){
        return ChainList.deployed().then(function(instance){
            chainListInstance = instance;
            return chainListInstance.buyArticle(1,{
                from: buyer,
                value: web3.toWei(2,"ether")
            });
        }).then(assert.fail)
        //test is expected to fail
        .catch(function(error) {
            assert(true)
        }).then(function(){
            //check that the state remains the same
            return chainListInstance.articles(1);
        }).then(function(data){
            //check that the state remains the same
            assert.equal(data[0].toNumber(),1,`article id must be 1`);
            assert.equal(data[1],seller,`seller must be ${seller}`);
            assert.equal(data[2],0x0,"buyer must be empty");
            assert.equal(data[3],articleName,`name must be ${articleName}`);
            assert.equal(data[4],articleDescription,`description must be ${articleDescription}`);
            assert.equal(data[5].toNumber(),web3.toWei(articlePrice,"ether"),`price must be ${web3.toWei(articlePrice,"ether")}`);
        });
    });

    //when buying article already sold
    it("should throw error when buying article already sold", function(){
        return ChainList.deployed().then(function(instance){
            chainListInstance = instance;
            return chainListInstance.sellArticle(
                articleName,
                articleDescription,
                web3.toWei(articlePrice,"ether")
                , {from : seller}
            )
        }).then(function(receipt){
            return chainListInstance.buyArticle(1,{
                from: buyer,
                value: web3.toWei(articlePrice,"ether")
            });
        }).then(function() {
            //it should fail the second time
            return chainListInstance.buyArticle(1,{
                from: buyer,
                value: web3.toWei(articlePrice,"ether")
            });
        })
        .then(assert.fail)
        //test is expected to fail
        .catch(function(error) {
            assert(true)
        }).then(function(){
            return chainListInstance.articles(1);
        }).then(function(data){
            //check that the state remains the same
            assert.equal(data[0].toNumber(),1,`article id must be 1`);
            assert.equal(data[1],seller,`seller must be ${seller}`);
            assert.equal(data[2],buyer,`buyer must be ${buyer}`);
            assert.equal(data[3],articleName,`name must be ${articleName}`);
            assert.equal(data[4],articleDescription,`description must be ${articleDescription}`);
            assert.equal(data[5].toNumber(),web3.toWei(articlePrice,"ether"),`price must be ${web3.toWei(articlePrice,"ether")}`);
        });
    });
});