let webStore = new Vue({
  el: "#app",
  data: {
    render: false,
    //index page data
    pageTitle: "Lessons to buy",
    classes: arrayOfClasses,
    showItems: true,
    populatedLocalStorage: false,
    addToCartButton: true,
    showBasketButton: false,

    //basket page data
    basketClassesArray: [],
    displayFields: true,
    displayBasketClasses: false,
    userName: "",
    userNum: null,
    validationMsgName: "",
    validationMsgNum: "",
    nameCorrect: false,
    numCorrect: false,
    displayCheckOut: false,
    confirmationTitle: "Order Completed! Here is your confirmation",
    confirmationSub: "Your order reference is:",
    confirmationRef: "xxxxxxxxxxxxx",
  },
  mounted: function () {
    //allows to execute methods on pageload
    this.loadLessons();

    this.checkLocalStorage();
  },
  watch: {
    userName(value) {
      // binding this to the data value in the email input
      this.userName = value;
      this.checkUserName(value);
    },
    userNum(value) {
      // binding this to the data value in the email input
      this.userNum = value;
      this.checkUserNum(value);
    },
  },
  methods: {
    loadLessons: function(){
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};
fetch("/api/lessons", options).then((response) => response.json())
.then((data) => {
  this.classes = data;
  console.log(data)
  this.render = true;
});

    },
    initializeSort: function (event) {
      let order = document.getElementById("order").value;
      let attribute = document.getElementById("attribute").value;

      //sort descending for price
      if (order == "ascending" && attribute == "price") {
        arrayOfClasses.sort(function (a, b) {
          return parseInt(a.price) - parseInt(b.price);
        });
      }
      //sort ascending for price
      else if (order == "descending" && attribute == "price") {
        arrayOfClasses.sort(function (a, b) {
          return parseInt(a.price) - parseInt(b.price);
        });
        arrayOfClasses.reverse();
      } else if (order == "descending" && attribute == "availability") {
        arrayOfClasses.sort(function (a, b) {
          return parseInt(a.spaces) - parseInt(b.spaces);
        });
        arrayOfClasses.reverse();
      } else if (order == "ascending" && attribute == "availability") {
        arrayOfClasses.sort(function (a, b) {
          return parseInt(a.spaces) - parseInt(b.spaces);
        });
      }
      //sort ascending for subject
      else if (order == "ascending" && attribute == "subject") {
        arrayOfClasses.sort(function (a, b) {
          var stringA = a.subject.toLowerCase(),
            stringB = b.subject.toLowerCase();
          if (stringA < stringB) return -1;
          if (stringA > stringB) return 1;
          return 0; //default return value (no sorting)
        });
      } else if (order == "descending" && attribute == "subject") {
        arrayOfClasses.sort(function (a, b) {
          var stringA = a.subject.toLowerCase(),
            stringB = b.subject.toLowerCase();
          if (stringA > stringB) return -1;
          if (stringA < stringB) return 1;
          return 0; //default return value (no sorting)
        });
      } else if (order == "descending" && attribute == "location") {
        arrayOfClasses.sort(function (a, b) {
          var stringA = a.location.toLowerCase(),
            stringB = b.location.toLowerCase();
          if (stringA > stringB) return -1;
          if (stringA < stringB) return 1;
          return 0; //default return value (no sorting)
        });
      } else if (order == "ascending" && attribute == "location") {
        arrayOfClasses.sort(function (a, b) {
          var stringA = a.location.toLowerCase(),
            stringB = b.location.toLowerCase();
          if (stringA < stringB) return -1;
          if (stringA > stringB) return 1;
          return 0; //default return value (no sorting)
        });
      }
    },

    addToBasket: function (id,spaces) {
     console.log(id)
     spaces -= 1;
     let dataArr = [{_id: id,spaces: spaces}];
     const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        body: JSON.stringify(dataArr),
      },
    };
    fetch("/api/lessons", options).then((response) => response.json())
    .then((data) => {
      this.classes = data;
      console.log(data)
      this.render = true;
    });
      this.showBasketButton = true;
    },
    checkLocalStorage: function () {
      //to run on load
      if (localStorage.getItem("basketIndexArray")) {
        this.populatedLocalStorage = true;
      }
    },
    
    loadBasketPage: function () {
      this.showItems = false;
      this.pageTitle = "Basket";
      this.showBasketButton = false;

      let arrayOfBasketSession = [];
      let basketClassesArrayTemp = [{}];
      arrayOfBasketSession = JSON.parse(localStorage.basketIndexArray);

      for (let x = 0; x < arrayOfBasketSession.length; x++) {
        for (let y = 0; y < arrayOfClasses.length; y++) {
          if (arrayOfBasketSession[x] == arrayOfClasses[y].id) {
            basketClassesArrayTemp = {
              id: arrayOfClasses[y].id,
              img: arrayOfClasses[y].img,
              subject: arrayOfClasses[y].subject,
              location: arrayOfClasses[y].location,
              price: arrayOfClasses[y].price,
            };
            this.basketClassesArray.push(basketClassesArrayTemp);
            this.displayBasketClasses = true;
            this.displayFields = true;
          }
        }
      }
    },
    loadMainPage: function () {
      this.showItems = true;
      this.pageTitle = "Lessons to buy";
      this.displayBasketClasses = false;
      if (localStorage.getItem("basketIndexArray")) {
        this.showBasketButton = true;
      }
      this.basketClassesArray = [];
    },
    removeClass: function (id) {
      let indexArray = [];
      indexArray = JSON.parse(localStorage.basketIndexArray);

      for (let i = 0; i < indexArray.length; i++) {
        if (indexArray[i] == id) {
          indexArray.splice(i, 1);
          localStorage.clear();
          this.basketClassesArray = [];

          if (indexArray.length !== 0) {
            localStorage.basketIndexArray = JSON.stringify(indexArray);
            this.loadBasketPage();
          } else {
            this.displayFields = false;
          }
          break;
        }
      }
    },
    checkUserName: function (value) {
      if (/^[A-Za-z]+$/.test(value)) {
        this.validationMsgName = "";
        this.nameCorrect = true;
      } else {
        this.validationMsgName = "Wrong input - only letters are allowed!";
        this.nameCorrect = false;
      }
    },
    checkUserNum: function (value) {
      console.log(Number.isInteger(value));
      if (/^\d+$/.test(value)) {
        this.validationMsgNum = "";
        this.numCorrect = true;
      } else {
        this.validationMsgNum = "Wrong input - only numbers are allowed!";
        this.numCorrect = false;
      }
    },

    loadCheckOut: function () {
      this.displayCheckOut = true;
    },
    
  },
});
