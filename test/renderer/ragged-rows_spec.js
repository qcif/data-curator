/**
 * Created by stephenfortune on 15/09/15.
 */
process.env.NODE_ENV = 'test';

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();

var hotController = require('./../../src/renderer/hot.js');
var raggedRows = require('./../../src/renderer/ragged-rows.js');
var $ = require('jquery/dist/jquery.js');

before(function(){
    rpanel = document.createElement('div');
    rpanel.setAttribute("id", "right-panel");
    mpanel = document.createElement('div');
    mpanel.setAttribute("id","message-panel");
    document.body.appendChild(mpanel);
    document.body.appendChild(rpanel);
});

function stubContainer() {
  var element = document.createElement('div')
  // document.body.appendChild(element)
  return element
}

beforeEach(function () {
  hotView = document.createElement('div');
  document.body.appendChild(hotView);
  hot = hotController.create(hotView);
});


describe('testing ragged row functions against 2D array', function(){

  it('well formed array results in no DOM change', function(){
    hot = hotController.create(stubContainer());
    var data = [
      ["", "Ford", "Volvo", "Toyota", "Honda"],
      ["2014", 10, 11, 12, 13],
      ["2015", 20, 11, 14, 11],
      ["2016", 30, 15, 12, 13]
    ];

    hot.loadData(data);
    raggedRows.fixRaggedRows(hot, hot.getData());
    console.log("inner text:")
    console.log(mpanel.innerText)
    expect(mpanel.innerText).to.not.have.string('has been added to file');

  });

  it('checks a loaded CSV and returns prompt on first discovery of ragged row', function(){
    hot = hotController.create(stubContainer());
    var data = [
      ["", "Ford", "Volvo", "Toyota", "Honda"],
      ["2014", 10, 11, 12, 13],
      ["2015", 20, 11, 14],
      ["2016", 30, 15, 12, 13]
    ];
    hot.loadData(data);
    raggedRows.fixRaggedRows(hot, hot.getData(), true);
    expect(mpanel.innerText).to.have.string('has been added to file');

  });

  it('changes a HandsOnTable object, given a ragged array, when prompt is answered with yes', function(){
    hot = hotController.create(stubContainer());
    var data = [
      ["", "Ford", "Volvo", "Toyota", "Honda"],
      ["2014", 10, 11, 12, 13],
      ["2015", 20, 11, 14],
      ["2016", 30, 15, 12, 13]
    ];

    hot.loadData(data);
    raggedRows.fixRaggedRows(hot, hot.getData(), true);
    expect(mpanel.innerText).to.have.string('has been added to file');
  });


  it('if ragged rows present and user consent it parses the entire CSV', function(){
    hot = hotController.create(stubContainer());
    var data = [
      ["", "Ford", "Volvo", "Toyota", "Honda"],
      ["2014", 10, 11, 12, 13],
      ["2015", 20, 11, 14],
      ["2016", 30, 15, 12, 13],
      ["2014", 10, 11, 12, 13],
      ["2015", 20, 11, 14],
      ["2016", 30, 15, 12, 13]
    ];

    hot.loadData(data);
    raggedRows.fixRaggedRows(hot,hot.getData(), true);
    expect(mpanel.innerText).to.have.string('has been added to file');
  });


});
