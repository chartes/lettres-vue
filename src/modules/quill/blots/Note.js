/*
 Lien
 Blot : inline
 Utilisation : Appel de note
*/

// TODO

import Quill from 'quill';

const ATTRIBUTES = [
  'href',
];
const getNoteId = domNode => { //domNode.getAttribute('href')//.substring(1)
  console.log("getNoteId :",  domNode.getAttribute('href').substring(1))
  return domNode.getAttribute('href').substring(1)
  //const re = /^#(.*)$/.exec(domNode.getAttribute('href'))
  //if (re[1]) return parseInt(re[1])
  //return ''
}

const getIndex = domNode => {
  console.log("getIndex :", domNode.innerText.match(/\d/g).join(""))
  return domNode.innerText.match(/\d/g).join("")
}

let Inline = Quill.import('blots/inline');

class NoteBlot extends Inline {
  deleteAt() {
    return false
  }
  static create(value) {
    console.log ("NoteBlot create init value : ", value)
    let node = super.create();
    console.log("NoteBlot create node", value, typeof(value))
    if (value.note) {
      node.setAttribute('href', '#' + value.note.id);
      if (value.note.index) {
        node.innerText = `[${value.note.index}]`
      }
    } else {
      node.setAttribute('href', '#' + value.id);
      /*if (value.index) {
        node.innerText = `[${value.index}]`
      }*/
    }
    console.log ("NoteBlot create node : ", node)
    return node;
  }
  /*static value(domNode) {
    console.log("NoteBlot static value : ", domNode)
    //return getNoteId(domNode)
    if (domNode.innerText.includes('[note]')) {
      return {id: getNoteId(domNode), index: getIndex(domNode)}
    } else {
      return {id: getNoteId(domNode), index: getIndex(domNode)}
    }
  }*/
  /*constructor(domNode, value) {
    console.log("constructor", domNode, value)


    super(domNode, value);
    if (value.pageNum) {
      domNode.innerText = `[p. ${value.pageNum}]`
    }
  }*/

  /*static value(domNode) {
    console.log ("NoteBlot static value : ", domNode);
    console.log ("NoteBlot static value return: ", {
      href: domNode.getAttribute('href'),
      pageNum: getPageNum(domNode.innerText)
    })
    return {
      href: domNode.getAttribute('href'),
      pageNum: getPageNum(domNode.innerText)
    }
  }*/


  format(name, data) {
    console.log("NoteBlot format(name, value)", name, data )
    if (name === 'note') {
      if (data !== null && data !== false) {
        console.log("format(name, data) cond 0 : ", name, data)
        /*console.log("cond 0", this.domNode)
        super.remove(name, value);
        return*/
        if (data.id) { //this.domNode.getAttribute('href').substring(1) !==
          console.log("cond 1", data.id)
          this.domNode.setAttribute('href', '#' + data.id)
        } else {
          this.domNode.setAttribute('href', "#");
        }
        if (data.index) {
          //this.domNode.innerText = `[${data.index}]`
          //this.domNode.innerHTML = this.domNode.innerHTML.replace(/\uFEFF/gm, "")
          //this.domNode.innerHTML = this.domNode.innerHTML.replace(/<span.*>(\[\d*])<\/span>/g, "$1")
          console.log("cond 2", this.domNode)
        } else if (data.note) {
          this.domNode.innerText = `[${data.note.index}]`
          this.domNode.setAttribute('href', '#' + data.note.id)
          console.log("cond change note link", this.domNode)
        } else {
          this.domNode.innerText = `[note]`
          console.log("cond 3", this.domNode)
        }
      } else if (data === null) {
        console.log("format(name, data) cond B : ", name, data)
        super.format(name, data)
        //super.format(name, value);
      } else if (data === false) {
        console.log("format(name, data) cond C : ", name, data)
        super.remove(name, data);
      }
    } else {
      console.log("format(name, data) cond D : ", name, data)
      super.format(name, data);
    }
  }
  static formats(domNode) {
    console.log("NoteBlot formats domNode : ", domNode)
    if (domNode.innerText.match(/\d/g) !== null ) {
      console.log("NoteBlot node.innerText", domNode.innerText.length, domNode.innerText)
      console.log("NoteBlot formats return 1", {id: getNoteId(domNode), index: getIndex(domNode)})
      return {id: getNoteId(domNode), index: getIndex(domNode)}
    } else {
      console.log("NoteBlot formats return 2", {id: getNoteId(domNode), index: null})
      return {id: getNoteId(domNode), index: null}
    }
  }
  /*formats() {
    let formats = super.formats();
    console.log("formats :", formats)
    formats['note'] = NoteBlot.formats(this.domNode);
    return formats;
  }*/

}
NoteBlot.blotName = 'note';
NoteBlot.tagName = 'a';
NoteBlot.className = 'note';

export default NoteBlot;
