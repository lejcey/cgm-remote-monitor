'use strict';

var should = require('should');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

var template = fs.readFileSync(path.join(__dirname, '../views/partials/toolbar.ejs'), 'utf8');

function renderToolbar (locals) {
  return ejs.render(template, locals);
}

describe('toolbar ICP number', function () {

  it('renders the ICP link on the index page when configured', function () {
    var html = renderToolbar({ settings: { icpNumber: '黔ICP备12345678号' }, type: 'index', title: '' });
    html.should.containEql('href="https://beian.miit.gov.cn/"');
    html.should.containEql('target="_blank"');
    html.should.containEql('rel="noopener noreferrer"');
    html.should.containEql('黔ICP备12345678号');
  });

  it('does not render the ICP link when icpNumber is empty', function () {
    var html = renderToolbar({ settings: { icpNumber: '' }, type: 'index', title: '' });
    html.should.not.containEql('https://beian.miit.gov.cn/');
    html.should.not.containEql('id="icpNumber"');
  });

  it('does not render the ICP link on non-index pages', function () {
    var html = renderToolbar({ settings: { icpNumber: '黔ICP备12345678号' }, type: 'report', title: 'Nightscout reporting' });
    html.should.not.containEql('https://beian.miit.gov.cn/');
    html.should.not.containEql('id="icpNumber"');
  });

  it('escapes HTML special characters in the ICP number', function () {
    var html = renderToolbar({ settings: { icpNumber: '<b>"a&b"</b>' }, type: 'index', title: '' });
    html.should.not.containEql('<b>"a&b"</b>');
    html.should.containEql('&lt;b&gt;&#34;a&amp;b&#34;&lt;/b&gt;');
  });

});
