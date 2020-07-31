var ChainList = artifacts.require("./ChainList.sol");

//test suite
contract('ChainList', function(accounts) {
    var chainListInstance;
    var seller = accounts[0];
    var buyer = accounts[1];
    var articleName1 = "article 1";
    var articleDescription1 = "desc article 1";
    var articlePrice1 = 10;
    var articleName2 = "article 2";
    var articleDescription2 = "desc article 2";
    var articlePrice2 = 20;
    var sellerBalanceBeforeBuy,sellerBalanceAfterBuy;
    var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;

    it('should be initialized with empty values', function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.getNumberArticles();
        }).then(function(data) {
            assert.equal(data.toNumber(),0,"number of articles must be zero");
            return chainListInstance.getUnsoldArticles();
        }).then(function(data){
            assert.equal(data.length,0,"there should be no article for sale");
        });
    });

    it('should sell an article', function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(
                articleName1,
                articleDescription1,
                web3.toWei(articlePrice1,"ether")
                , {from : seller}
            );
        })
            .then(function(receipt) {
                assert.equal(receipt.logs.length,1,"one event triggered");
                assert.equal(receipt.logs[0].event,"LogSellArticle","event should be LogSellArticle");
                assert.equal(receipt.logs[0].args._id.toNumber(),1,`event id must be 1`);
                assert.equal(receipt.logs[0].args._seller,seller,`event seller must be ${seller}`);
                assert.equal(receipt.logs[0].args._name,articleName1,`event must be ${articleName1}`);
                assert.equal(receipt.logs[0].args._price.toNumber(),web3.toWei(articlePrice1,"ether"),`event must be ${web3.toWei(articlePrice1,"ether")}`);
            
                return chainListInstance.getNumberArticles(); 
            }).then(function(data) {
                assert.equal(data.toNumber(),1,"number of articles must be 1");
                return chainListInstance.getUnsoldArticles();
            }).then(function(data){
                assert.equal(data.length,1,"there should be 1 article for sale");
                assert.equal(data[0].toNumber(),1,"article id must be 1");
                // assert.equal(data[1],seller,"seller must be " + seller);
                // assert.equal(data[2],0x0,"buyer must be empty");
                // assert.equal(data[3],articleName1,"name must be " + articleName1);
                // assert.equal(data[4],articleDescription1,"description must be " + articleDescription1);
                // assert.equal(data[5].toNumber(),web3.toWei(articlePrice1,"ether"),"price must be " + web3.toWei(articlePrice1,"ether"));
                
                return chainListInstance.articles(data[0]);
            })
            .then(function(data){
                assert.equal(data[0].toNumber(),1,"article id must be 1");
                assert.equal(data[1],seller,"seller must be " + seller);
                assert.equal(data[2],0x0,"buyer must be empty");
                assert.equal(data[3],articleName1,"name must be " + articleName1);
                assert.equal(data[4],articleDescription1,"description must be " + articleDescription1);
                assert.equal(data[5].toNumber(),web3.toWei(articlePrice1,"ether"),"price must be " + web3.toWei(articlePrice1,"ether"));
            });
    });

    it('should sell a second article', function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(
                articleName2,
                articleDescription2,
                web3.toWei(articlePrice2,"ether")
                , {from : seller}
            );
        })
            .then(function(receipt) {
                assert.equal(receipt.logs.length,1,"one event triggered");
                assert.equal(receipt.logs[0].event,"LogSellArticle","event should be LogSellArticle");
                assert.equal(receipt.logs[0].args._id.toNumber(),2,`event id must be 2`);
                assert.equal(receipt.logs[0].args._seller,seller,`event seller must be ${seller}`);
                assert.equal(receipt.logs[0].args._name,articleName2,`event must be ${articleName2}`);
                assert.equal(receipt.logs[0].args._price.toNumber(),web3.toWei(articlePrice2,"ether"),`event must be ${web3.toWei(articlePrice2,"ether")}`);
            
                return chainListInstance.getNumberArticles(); 
            }).then(function(data) {
                assert.equal(data.toNumber(),2,"number of articles must be 2");
                return chainListInstance.getUnsoldArticles();
            }).then(function(data){
                assert.equal(data.length,2,"there should be 2 articles for sale");
                assert.equal(data[1].toNumber(),2,"article id must be 2");
                // assert.equal(data[1],seller,"seller must be " + seller);
                // assert.equal(data[2],0x0,"buyer must be empty");
                // assert.equal(data[3],articleName1,"name must be " + articleName1);
                // assert.equal(data[4],articleDescription1,"description must be " + articleDescription1);
                // assert.equal(data[5].toNumber(),web3.toWei(articlePrice1,"ether"),"price must be " + web3.toWei(articlePrice1,"ether"));
                
                return chainListInstance.articles(data[1]);
            })
            .then(function(data){
                assert.equal(data[0].toNumber(),2,"article id must be 2");
                assert.equal(data[1],seller,"seller must be " + seller);
                assert.equal(data[2],0x0,"buyer must be empty");
                assert.equal(data[3],articleName2,"name must be " + articleName2);
                assert.equal(data[4],articleDescription2,"description must be " + articleDescription2);
                assert.equal(data[5].toNumber(),web3.toWei(articlePrice2,"ether"),"price must be " + web3.toWei(articlePrice2,"ether"));
            });
    });

    it('should buy an article', function(){
        return ChainList.deployed().then(function(instance){
            chainListInstance = instance;
            //balances before buy
            buyerBalanceBeforeBuy= web3.fromWei(web3.eth.getBalance(buyer),"ether").toNumber();
            sellerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(seller),"ether").toNumber();

            return chainListInstance.buyArticle(1,{
                from: buyer,
                value: web3.toWei(articlePrice1,"ether")
            }).then(function(receipt) {
                assert.equal(receipt.logs.length,1,"one event triggered");
                assert.equal(receipt.logs[0].event,"LogBuyArticle","event should be LogBuyArticle");
                assert.equal(receipt.logs[0].args._id.toNumber(),1,`event id must be 1`);
                assert.equal(receipt.logs[0].args._seller,seller,`event seller must be ${seller}`);
                assert.equal(receipt.logs[0].args._buyer,buyer,`event buyer must be ${buyer}`);
                assert.equal(receipt.logs[0].args._name,articleName1,`event must be ${articleName1}`);
                assert.equal(receipt.logs[0].args._price.toNumber(),web3.toWei(articlePrice1,"ether"),`event must be ${web3.toWei(articlePrice1,"ether")}`);
                
                buyerBalanceAfterBuy= web3.fromWei(web3.eth.getBalance(buyer),"ether").toNumber();
                sellerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(seller),"ether").toNumber();

                //accounting for gas
                assert(sellerBalanceAfterBuy == sellerBalanceBeforeBuy + articlePrice1,`seller should have earned ${articlePrice1} ETH`);
                assert(buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - articlePrice1,`buyer should have paid ${articlePrice1} ETH`);

                return chainListInstance.getNumberArticles(); 
            }).then(function(data) {
                assert.equal(data.toNumber(),2,"number of articles must be 2");
                return chainListInstance.getUnsoldArticles();
            }).then(function(data){
                assert.equal(data.length,1,"there should be 1 article left for sale");
                assert.equal(data[0].toNumber(),2,"article id must be 2");
            })
        });
    });

    // it('should trigger an event when a new article is sold', function() {
    //     return ChainList.deployed().then(function(instance) {
    //         chainListInstance = instance;
    //         return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice,"ether"), {from: seller});
    //     }).then(function(receipt) {
    //         assert.equal(receipt.logs.length,1,"one event triggered");
    //         assert.equal(receipt.logs[0].event,"LogSellArticle","event should be LogSellArticle");
    //         assert.equal(receipt.logs[0].args._seller,seller,`event seller must be ${seller}`);
    //         assert.equal(receipt.logs[0].args._name,articleName,`event must be ${articleName}`);
    //         assert.equal(receipt.logs[0].args._price.toNumber(),web3.toWei(articlePrice,"ether"),`event must be ${web3.toWei(articlePrice,"ether")}`);
    //     });
    // })
});