/*
 Note
 Blot : embed
 Utilisation : Appel de note
*/

//import Parchment from 'parchment';
import Quill from 'quill';

const Embed  = Quill.import('blots/embed')

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

export default class NoteBlot extends Embed {

  static create(value) {
    let node = super.create(value);
    console.log("static create", value, typeof(value))
    if (value.index) {
      node.setAttribute('href', '#' + value.id);
      //node.setAttribute('contenteditable', false);
      node.innerText = `[${value.index}]`

    } else {
      node.setAttribute('href', '#' + value);
      //node.setAttribute('contenteditable', false);
      node.innerText = `[note]`
    }
    console.log("static create", node)
    return node;
  }
  static value(domNode) {
    console.log("static value : ", domNode)
    //return getNoteId(domNode)
    if (domNode.innerText.includes('[note]')) {
      return {id: getNoteId(domNode), index: getIndex(domNode)}
    } else {
      return {id: getNoteId(domNode), index: getIndex(domNode)}
    }
  }
  constructor(domNode, value) {
    console.log("constructor", domNode, value)

    domNode.setAttribute('contenteditable', false)
    let original =  domNode.innerHTML
    console.log("test : ", original, "\n", domNode.innerHTML)
    super(domNode, value);
    domNode.innerHTML = domNode.innerHTML.replace(/\uFEFF/gm, "")
    domNode.innerHTML = domNode.innerHTML.replace(/<span.*>(\[\d*])<\/span>/g, "$1")
  }

  static formats(domNode) {
    if (domNode.innerText.match(/\d/g).join("")) {
      return {note: {id: getNoteId(domNode), index: getIndex(domNode)}}
    } else {
      return {note: {id: getNoteId(domNode)}}
    }
  }



  format(name, value) {
    console.log("format(name, value)", ATTRIBUTES, name, value )
    if (name === 'note' && value) {
      if (this.domNode.getAttribute('href') !== value.id) {
        console.log("cond 1", this.domNode)
        if (value.index) {

          this.domNode.setAttribute(name, value.id);
          this.domNode.innerHTML = this.domNode.innerHTML.replace(/\uFEFF/gm, "")
          this.domNode.innerHTML = this.domNode.innerHTML.replace(/<span.*>(\[\d*])<\/span>/g, "$1")
          console.log("cond 2", this.domNode)
        } else {
          this.domNode.removeAttribute(name);
          console.log("cond 3", this.domNode)
        }
      } else {
        console.log("cond 4", this.domNode)
        super.format(name, value);
        console.log("cond 4", this.domNode)
      }
    } else {
    console.log("cond 5", this.domNode)
      super.format(name, value);
    console.log("cond 5", this.domNode)
    }
  }
}
NoteBlot.blotName = 'note';
NoteBlot.tagName = 'a';
NoteBlot.className = 'note';
