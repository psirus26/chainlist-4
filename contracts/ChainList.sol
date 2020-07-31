pragma solidity ^0.4.18;

import "./Ownable.sol";

contract ChainList is Ownable {
    //custom types
    struct Article {
        uint id;
        address seller;
        address buyer;
        string name;
        string description;
        uint256 price;
    }

    // state variables
    mapping (uint => Article) public articles;
    uint articleCounter;

    //events
    event LogSellArticle(
        uint indexed _id,
        address indexed _seller,
        string _name,
        uint256 _price
    );

    event LogBuyArticle(
        uint indexed _id,
        address indexed _seller,
        address indexed _buyer,
        string _name,
        uint256 _price
    );

    //deactivate contract
    //constructor and modifier are in Ownable contract
    function kill() public onlyOwner {
        selfdestruct(contractOwner);
    }

    //sell an article
    function sellArticle(string _name, string _description, uint256 _price) public {
        //new article
        articleCounter++;

        //must be in the same order as struct declaration
        articles[articleCounter] = Article(
            articleCounter, //id
            msg.sender, //seller
            0x0, //buyer
            _name, //name
            _description, //description
            _price //price
        );

        LogSellArticle(articleCounter,msg.sender,_name,_price);
    }

    //get an article
    // function getArticle() public view returns (
    //     address _seller,
    //     address _buyer,
    //     string _name,
    //     string _description,
    //     uint256 _price
    //     ) {
    //         return(seller,buyer,name,description,price);
    // }

    //number of articles stored in contract
    function getNumberArticles() public view returns (uint){
        return articleCounter; 
    }

    //return array of identifiers for unsold articles
    function getUnsoldArticles() public view returns (uint[]) {
        uint[] memory articleIds = new uint[](articleCounter);

        uint numberUnsoldArticles = 0;

        for(uint i=1; i<= articleCounter; i++) {
            if(articles[i].buyer == 0x0) {
                articleIds[numberUnsoldArticles] = articles[i].id;
                numberUnsoldArticles++;
            }
        }

        //copy articleIds array into a smaller array
        uint[] memory forSale = new uint[](numberUnsoldArticles);
        for(uint j=0; j< numberUnsoldArticles; j++) {
                forSale[j] = articleIds[j];
        }

        return forSale;
    }

    //buy an article
    function buyArticle(uint _id) public payable {
        //check if there is an article for sale
        require(articleCounter > 0);
        //check that id corresponds to an existing article
        require(_id >0 && _id <=articleCounter);

        Article storage article = articles[_id];
        //check that the article has not been sold yet
        require(article.buyer == 0x0);
        //we do not allow the seller to buy his own article
        require(msg.sender != article.seller);
        //value sent corresponds to the article price
        require(msg.value == article.price);

        //keep track of buyer's information
        article.buyer = msg.sender;

        //the buyer pays the seller
        article.seller.transfer(msg.value);

        //trigger the event
        LogBuyArticle(_id, article.seller, article.buyer, article.name, article.price);
    }
}