/*
 Lien
 Blot : inline
 TEI : ref[@target]
 HTML5 : a[@href]
 Utilisation : commentaire
*/

// TODO

import Quill from 'quill';

const getPageNum = txt => {
  const re = /\[p\. (.*)\]/.exec(txt)
  if (re[1]) return re[1]
  return ''
}

let Inline = Quill.import('blots/inline');

class PageBlot extends Inline {
  static create(value) {
    console.log ("PageBlot create value : ", value)
    let node = super.create();
    if (value.page) {
      node.setAttribute('href', value.page.href);
      node.setAttribute('target', '_blank');
      node.setAttribute('title', value.page.href)
      if (value.page.pageNum) {
        node.innerText = `[p. ${value.page.pageNum}]`
      }
    } else {
      node.setAttribute('href', value.href);
      node.setAttribute('target', '_blank');
      node.setAttribute('title', value.href)
    }
    /*if (value.pageNum) {
      node.innerText = `[p. ${value.pageNum}]`
    }*/
    //console.log ("PageBlot create innerText : ", node.innerText)
    console.log ("PageBlot create node : ", node)
    return node;
  }
  /*constructor(domNode, value) {
    console.log("constructor", domNode, value)


    super(domNode, value);
    if (value.pageNum) {
      domNode.innerText = `[p. ${value.pageNum}]`
    }
  }*/

  /*static value(domNode) {
    console.log ("static value : ", domNode);
    console.log ("static value return: ", {
      href: domNode.getAttribute('href'),
      pageNum: getPageNum(domNode.innerText)
    })
    return {
      href: domNode.getAttribute('href'),
      pageNum: getPageNum(domNode.innerText)
    }
  }*/

  /*formats(node) {
      console.log ("formats : ", node);
      console.log ("formats : ", {page:
            {
                href: node.getAttribute('href'),
                pageNum: getPageNum(node.innerText)
            }
        });
        return {page:
            {
                href: node.getAttribute('href'),
                pageNum: getPageNum(node.innerText)
            }
        }
  }*/
  format(name, data) {
    if (name === 'page') {
      console.log("format page data", name, data)
      if (data !== null && data !== false) {

        console.log("format(name, data) cond 0 : ", name, data)
        if (data.href) {
          console.log("format(name, data) cond 0.1 : ", name, data)
          this.domNode.setAttribute('target', '_blank');
          this.domNode.setAttribute('href', data.href);
          this.domNode.setAttribute('title', data.href);
        }
        this.domNode.innerText = `[p. ${data.pageNum}]`


        console.log ("PageBlot create innerText : ", this.domNode.innerText)
      } else if (data === null) {
        console.log("format(name, data) cond B : ", name, data)
        //super.remove(name, data)
        super.format(name, data);
      } else if (data === false) {
        console.log("format(name, data) cond C : ", name, data)
        super.remove(name, data);
      } else {console.log("format(name, data) cond E : ", name, data)}
    } else {
        console.log("format(name, data) cond D : ", name, data)
        super.format(name, data);
    }
  }
  static formats(node) {
    console.log("PageBlot formats :", node )
    if (node.innerText.match(/\[p\. (.*)\]/g)) {
      console.log("PageBlot node.innerText", node.innerText.length, node.innerText)
      return { href: node.getAttribute('href'),
               pageNum: getPageNum(node.innerText)
              }
    } else {
      return {
        href: node.getAttribute('href'),
        pageNum: ""
      }
    }

  }

}
PageBlot.blotName = 'page';
PageBlot.tagName = 'a';
PageBlot.className = 'pb';

export default PageBlot;
